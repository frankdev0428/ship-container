import React, { useCallback, useEffect, useState } from 'react'
import {
  Box,
  BoxProps,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { useGridApiRef } from '@mui/x-data-grid-pro'

import { AppState } from '../../../store'
import { showError } from '../../../store/error/actions'
import GenericTable from '../shared/GenericTable/Table'
import { listEquipments, listAvailableEquipments } from '../../../services/equipment/actions'
import { genericHandleRowClick, genericHandleSelectAllClick } from '../shared/GenericTable/utils'
import AvailabilityButton from '../Containers/AvailabilityButton'
import CollapsibleChips from '../shared/Filter/CollapsibleChips'
import { filterContainers } from '../Containers/Filter/utils'
import { getTimeLabel } from '../shared/utils'
import { ENABLE_DATAGRID } from '../../globals'
import Searchbar from '../shared/Search'

import ContainerRow, { mapToContainerRow, ContainerRowProps, ContainerRowDataProps } from './AllocationRow'
import { inititalContainerHeadCells } from './OrderCollapsedData/Allocations'
import AllocateDatagrid from './AllocateDatagrid'
import { filterContainerAllocs } from './NewOrder/Filter/utils'

interface AllocateDialogProps {
  handleClose: () => void;
  handleAllocate: (equipments: string[]) => void;
  allocationOrder?: {
    dateFrom?: Date;
    dateTo?: Date;
    facilityFrom?: string;
  };
  noDialog?: boolean;
}

const AllocateDialog = ({ handleClose, handleAllocate, allocationOrder, noDialog }: AllocateDialogProps) => {
  const [isFilterAvailableOnly, setIsFilterAvailable] = useState<boolean>(false)
  const [selected, setSelected] = useState<string[]>([])
  const _dispatch = useDispatch()

  const { loadingStatus, equipments, availableEquipments } = useSelector((state: AppState) => state.equipment)
  const { companies } = useSelector((state: AppState) => state.company)
  const { facilities } = useSelector((state: AppState) => state.places)
  const { storage, lease } = useSelector((state: AppState) => state.financials)
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)
  const { shouldUseBackend } = useSelector((state: AppState) => state.settings)

  const [dateFrom, setDateFrom] = useState<Date | undefined>(allocationOrder?.dateFrom)
  const [dateTo, setDateTo] = useState<Date | undefined>(allocationOrder?.dateTo)
  const [depotFrom, setDepotFrom] = useState<string | undefined>(allocationOrder?.facilityFrom)
  const [filterCombined, setFilterCombined] = useState<string>(`${dateFrom?.toISOString()}${dateTo?.toISOString()}${depotFrom}`)
  const apiRef = useGridApiRef()
  const [searchFilter, setSearchFilter] = useState('')
  const [rowData, setContainerAllocs] = useState<ContainerRowDataProps[]>([])

  const getFacilityName = (fid?: string) => facilities.find(f => f.facilityId === fid)?.name || fid

  useEffect(() => {
    _dispatch(listEquipments({}, shouldUseBackend))
  }, [shouldUseBackend])

  useEffect(() => {
    if (ENABLE_DATAGRID && datagridState?.allocate && apiRef?.current?.restoreState) {
      apiRef.current.restoreState(datagridState.allocate)
    }
  }, [])

  useEffect(() => {
    if (isFilterAvailableOnly) {
      dateFrom && dateTo && setAvailabilityChip({
        label: depotFrom
          ? `Available: from ${getTimeLabel(dateFrom)} to ${getTimeLabel(dateTo)} in ${getFacilityName(depotFrom)}`
          : `Available: from ${getTimeLabel(dateFrom)} to ${getTimeLabel(dateTo)}`,
        show: true,
      })

      dateFrom && _dispatch(
        listAvailableEquipments({
          statusFrom: dateFrom.toISOString(),
          statusTo: (dateTo || dateFrom).toISOString(),
          status: ['AVAILABLE'],
          startStatusAtLocationId: depotFrom ? [depotFrom] : undefined,
        }),
      )
    } else {
      dateFrom && dateTo && setAvailabilityChip({
        label: depotFrom
          ? `Available: from ${getTimeLabel(dateFrom)} to ${getTimeLabel(dateTo)} in ${getFacilityName(depotFrom)}`
          : `Available: from ${getTimeLabel(dateFrom)} to ${getTimeLabel(dateTo)}`,
        show: false,
      })
    }
  }, [isFilterAvailableOnly, filterCombined])

  useEffect(() => {
    if (equipments.length) {
      const eqs = isFilterAvailableOnly ? availableEquipments : equipments

      setContainerAllocs(filterContainerAllocs(eqs.map(e => mapToContainerRow(e, companies, facilities, storage, lease, undefined, shouldUseBackend)), searchFilter))
    } else {
      setContainerAllocs([])
    }
  }, [equipments, companies, facilities, storage, lease, searchFilter])

  const containerHeadCells = [...inititalContainerHeadCells].slice(0, -1) // no actions
  // containerHeadCells[1].hide = true
  // containerHeadCells[3].hide = true

  const eqs = isFilterAvailableOnly ? availableEquipments : equipments

  // const rowData = eqs.map(e => mapToContainerRow(e, companies, facilities, storage, lease, undefined, shouldUseBackend))

  const handleSelectAllClick = genericHandleSelectAllClick(eqs, setSelected)

  const handleRowClick = genericHandleRowClick(selected, setSelected)

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const toggleIsFilterAvailable = () => {
    setIsFilterAvailable(!isFilterAvailableOnly)
  }

  const selectedIds = eqs.filter(e => e.aelerContainerId && selected.includes(e.aelerContainerId)).map(e => e.equipmentId)
  const selectedEqsInProd = eqs.filter(e => e.aelerContainerId && selected.includes(e.aelerContainerId)).filter(e => {
    return e.currentStatus?.status === 'PRODUCTION' && (e.currentStatus.validToPlanned === undefined || moment(e.currentStatus.validToPlanned).isBefore())
  }).map(e => e.aelerContainerId)

  selectedEqsInProd.length > 0 && _dispatch(showError(['Cannot allocate containers in production, please remove them or finish production: ' + selectedEqsInProd.join(', ')]))

  const handleClick = () => {
    selectedIds
      ? handleAllocate(selectedIds)
      : _dispatch(showError(['Must choose one order']))
  }

  const [availabilityChip, setAvailabilityChip] = useState({ label: '', show: false })

  const chips_ = availabilityChip.show
    ? [{
        label: availabilityChip?.label,
        onRemove: () => {
          setAvailabilityChip({ ...availabilityChip, show: false })
          // _dispatch(listEquipments({}))
          setIsFilterAvailable(false)
        },
      }]
    : []

  const handleCheckAvailability = (dateFrom: Date | null, dateTo: Date | null, depotIds: string[]) => {
    if (!dateFrom /* || depotIds.length === 0 */) {
      _dispatch(showError(['Date and Facility ID are required.']))
      return
    }

    const depotFrom = depotIds && depotIds.length > 0 ? depotIds[0] : undefined

    setDateFrom(dateFrom || undefined)
    setDateTo(dateTo || undefined)
    setDepotFrom(depotFrom)

    setIsFilterAvailable(true)
    setFilterCombined(`${dateFrom?.toISOString()}${dateTo?.toISOString()}${depotFrom}`)
  }

  const onSelectionChange = useCallback((ids:string[]) => setSelected(ids), [])

  const Content = <>
    <Box mt={2} mb={1} display='flex' alignItems='center' flexWrap={'wrap'}>
      <Box flexGrow={1} display='flex' alignItems='center' flexWrap={'wrap'}>
        <FormControlLabel
          control={
            <Checkbox
              color='primary'
              checked={isFilterAvailableOnly}
              // inputProps={{ 'aria-labelledby': labelId }}
              disabled={!allocationOrder}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                toggleIsFilterAvailable()
              }}
            />
          }
          label={'Only show available'}
        />
        <Box mb={1}>
          <CollapsibleChips open={Boolean(chips_.length)} chips={chips_} />
        </Box>
      </Box>
      <AvailabilityButton
        onClick={handleCheckAvailability}
        fromDate={allocationOrder?.dateFrom}
        toDate={allocationOrder?.dateTo || allocationOrder?.dateFrom}
        depots={allocationOrder?.facilityFrom ? [allocationOrder.facilityFrom] : undefined}
      />
    </Box>
    {
      ENABLE_DATAGRID &&
        <Box width={300} mb={1}>
          <Searchbar
            placeholder={'Search containers...'}
            filter={searchFilter}
            setFilter={setSearchFilter}
            clearAll={() => setSearchFilter('')}
          />
        </Box>
    }
    <Box display='flex' flexDirection='column' height={'100vh'} width={'80vw'}>
      {
        ENABLE_DATAGRID
          ? <AllocateDatagrid selectedIds={selected} loading={loadingStatus} rowData={rowData} onSelectionChange={onSelectionChange}/>
          : <GenericTable
              size='small'
              singleSelect
              headerCells={containerHeadCells}
              orderBy='idleDays'
              order='desc'
              rows={rowData}
              selected={[]}
              handleSelectAllClick={handleSelectAllClick}
              searchBy={filterContainers}
              searchPlaceholder={'Search containers...'}
              rowComponent={({ ...container }: ContainerRowProps) => (
                <ContainerRow
                  {...container}
                  key={container.id}
                  handleRowClick={handleRowClick}
                  isSelected={isSelected(container.id)}
                  noActions={true}
                />
              )}
            />
      }
    </Box>
  </>

  return noDialog
    ? (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {Content}
        <Box>
          {/* <Button size='small' color='primary' onClick={handleClose}>Close</Button> */}
          <Button size='small' color='primary' variant='contained' onClick={handleClick}>Allocate</Button>
        </Box>
      </Box>
      )
    : (
    <Dialog open={true} maxWidth={'xl'} onClose={handleClose}>
      <DialogTitle>
        Assignable Containers
        { loadingStatus && <CircularProgress sx={{ marginLeft: '16px' }} size={20} /> }
        </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
        {Content}
      </DialogContent>
      <DialogActions>
        <Button size='small' color='primary' /* variant='outlined' */ onClick={handleClose}>Close</Button>
        <Button size='small' color='primary' variant='contained' onClick={handleClick} disabled={selectedEqsInProd.length > 0}>Allocate</Button>
      </DialogActions>
    </Dialog>
      )
}

interface AllocateProps extends BoxProps {
  disabled?: boolean;
  onAllocate: (equipments: string[]) => void;
  allocationOrder?: {
    dateFrom?: Date;
    dateTo?: Date;
    facilityFrom?: string;
  };
  noDialog?: boolean;
}

const Allocate = ({ disabled, onAllocate, allocationOrder, noDialog, ...boxProps }: AllocateProps): JSX.Element => {
  const [open, setOpen] = useState(false)

  const handleAllocate = (equipments: string[]) => {
    setOpen(false)
    onAllocate(equipments)
  }

  return noDialog
    ? (
    <AllocateDialog handleClose={() => setOpen(false)} handleAllocate={handleAllocate} allocationOrder={allocationOrder} noDialog={noDialog}/>
      )
    : (
    <Box {...boxProps}>
      <Button variant='outlined' size='small' color='primary' disabled={disabled} sx={{ margin: '0 16px' }} onClick={() => setOpen(true)}>
        Allocate
      </Button>
      { open && <AllocateDialog handleClose={() => setOpen(false)} handleAllocate={handleAllocate} allocationOrder={allocationOrder}/>}
    </Box>
      )
}

export default Allocate
