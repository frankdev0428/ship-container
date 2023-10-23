import { Box, Collapse, Grid, styled, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { listEquipments } from '../../../../services/equipment/actions'
import { EquipmentLeaseInput } from '../../../../services/lease/types'
import { AppState } from '../../../../store'
import { setAllocateFilters } from '../../../../store/ui/actions'
import { ENABLE_DATAGRID } from '../../../globals'
import CollapsibleChips from '../../shared/Filter/CollapsibleChips'
import FilterButton, { FilterChip, StateFilter } from '../../shared/Filter/FilterButton'
import GenericTable from '../../shared/GenericTable/Table'
import Searchbar from '../../shared/Search'
import StyledChip from '../../shared/StyledChip'
import { getTimeLabel } from '../../shared/utils'
import { DisableableTypography } from '../../Utils/Typography'
import AllocateDatagrid from '../AllocateDatagrid'
import ContainerRow, { ContainerRowDataProps, ContainerRowProps, mapToContainerRow } from '../AllocationRow'
import { inititalContainerHeadCells } from '../OrderCollapsedData/Allocations'

import { containerAllocOptions, containerAllocsFilter, filterContainerAllocs, getContainerAllocOptions } from './Filter/utils'
import { AllocatableEquipmentsProps } from './NewOrderButton'

const StyledGridItem = styled(Grid)({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
})

const StyledWrapperBox = styled(Box)({
  width: '100%',
  backgroundColor: '#f9f9fb',
  padding: '20px',
})

const StyledContainerGrid = styled(Grid)({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const StyledCollapse = styled(Collapse)(({ theme }) => ({
  width: '100%',
  background: '#EBF0F8',
  padding: '10px 16px 10px 16px',
  '& .MuiCollapse-wrapperInner': {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
}))

interface AllocateContainerFormProps {
  order: EquipmentLeaseInput
  allocatableEquipments: AllocatableEquipmentsProps[];
  handleChangeEquipments: (equipments: AllocatableEquipmentsProps[]) => void
}

const AllocateContainerForm = ({ order, handleChangeEquipments, allocatableEquipments }: AllocateContainerFormProps) : JSX.Element => {
  const [searchFilter, setSearchFilter] = useState('')

  const [filteredContainerAllocs, setFilteredContainerAllocs] = useState<{ containerAllocs: ContainerRowDataProps[], numOfFilters: number}>({ containerAllocs: [], numOfFilters: 0 })
  const [chips, setChips] = useState<FilterChip[] | null>(null)
  const [rowData, setContainerAllocs] = useState<ContainerRowDataProps[]>([])

  const facilities = useSelector((state: AppState) => state.places.facilities)
  const equipments = useSelector((state: AppState) => state.equipment.equipments)
  const loading = useSelector((state: AppState) => state.equipment.loadingStatus)
  const companies = useSelector((state: AppState) => state.company.companies)
  const storage = useSelector((state: AppState) => state.financials.storage)
  const lease = useSelector((state: AppState) => state.financials.lease)
  const allocateFilters = useSelector((state: AppState) => state.ui.allocateFilters)

  const theme = useTheme()
  const _dispatch = useDispatch()

  const setFilters = (filters: StateFilter[]) => _dispatch(setAllocateFilters(filters))

  useEffect(() => {
    _dispatch(listEquipments({}))
  }, [])

  useEffect(() => {
    if (equipments.length) {
      setContainerAllocs(filterContainerAllocs(equipments.map(e => mapToContainerRow(e, companies, facilities, storage, lease)), searchFilter))
    } else {
      setContainerAllocs([])
    }
  }, [equipments, companies, facilities, storage, lease, searchFilter])

  const orderTop = [{ label: 'Order ID', value: order?.orderId },
    { label: 'Collection', value: order?.executionDate ? getTimeLabel(order.executionDate) : undefined },
    { label: 'Return', value: order?.returnDate ? getTimeLabel(order.returnDate) : undefined },
  ]

  const orderBottom = [{ label: 'Container units', value: order?.units },
    { label: undefined, value: facilities.find(c => c.facilityId === order?.pickupLocation)?.name },
    { label: undefined, value: facilities.find(c => c.facilityId === order?.dropoffLocation)?.name },
  ]

  const containerHeadCells = [...inititalContainerHeadCells].slice(0, -1) // no actions

  const handleFiltersChange = (containerAllocs: ContainerRowDataProps[], chips: FilterChip[] | null) => {
    const numOfFilters = (searchFilter !== '' ? 1 : 0) + (chips ? chips.length : 0)
    setFilteredContainerAllocs({ containerAllocs: filterContainerAllocs(containerAllocs, searchFilter), numOfFilters })
    setChips(chips)
    // handleChange([])
  }

  const chips_ = [
    ...(chips || []),
  ]

  const isSelected = (id: string) => allocatableEquipments.map((e) => e.equipmentId).indexOf(id) !== -1

  const handleRowClick = (equipment: AllocatableEquipmentsProps) => {
    if (allocatableEquipments.find((e) => e.equipmentId === equipment.equipmentId)) {
      handleChangeEquipments(allocatableEquipments.filter((e) => e.equipmentId !== equipment.equipmentId))
    } else {
      handleChangeEquipments([...allocatableEquipments, equipment])
    }
  }

  const handleDatagridSelectionChange = (equipmentIds: string[]) => {
    if (equipmentIds) {
      /**
       * row ids are mapped from API equipments  as equipment.aelerContainerId || equipment.equipmentId
       * Check `mapToContainerRow` in AllocationRow.tsx
       */
      handleChangeEquipments(equipments.filter((e) => equipmentIds.includes(e.aelerContainerId || e.equipmentId))
        .map(e => ({ equipmentId: e.equipmentId, id: e.aelerContainerId || e.equipmentId })))
    } else {
      handleChangeEquipments([])
    }
  }

  return (
    <Box>
      <StyledWrapperBox>
        <StyledContainerGrid container>
          {
            orderTop.map((o, index) => (
              <StyledGridItem key={index} item xs={3.9}>
                <Typography variant='body2' sx={{ fontWeight: 'bold', color: theme.palette.text.unselected }}>
                  {o.label}
                </Typography>
                <DisableableTypography variant='body2' sx={{ color: theme.palette.text.unselected }}>
                  {o.value}
                </DisableableTypography>
              </StyledGridItem>
            ))
          }
        </StyledContainerGrid>
        <StyledContainerGrid container>
          {
            orderBottom.map((o, index) => (
              <StyledGridItem key={index} item xs={3.9}>
                {
                  o.label !== undefined &&
                  <Typography variant='body2' sx={{ fontWeight: 'bold', color: theme.palette.text.unselected }}>
                    {o.label}
                  </Typography>
                }
                <DisableableTypography variant='body2' sx={{ color: theme.palette.text.unselected }}>
                  {o.value}
                </DisableableTypography>
              </StyledGridItem>
            ))
          }
        </StyledContainerGrid>
      </StyledWrapperBox>
      <Box mt={2} display='flex' flexWrap={'wrap'} flexDirection='column' alignItems='flex-start'>
        <Box display='flex' flexDirection='row' width='100%' justifyContent='space-between'>
          <Searchbar
            placeholder={'Search containers...'}
            filter={searchFilter}
            setFilter={setSearchFilter}
            clearAll={() => setSearchFilter('')}
          />
          <FilterButton
            disabled={false}
            data={rowData}
            dataFilter={containerAllocsFilter}
            options={containerAllocOptions}
            getOptions={getContainerAllocOptions}
            onFilter={handleFiltersChange}
            filters={allocateFilters}
            setFilters={setFilters}
            PopperProps={{ disablePortal: true }}
          />
        </Box>
        <Box mb={2} mt={2} display='flex' flexDirection='row' gap={1}>
          <CollapsibleChips open={Boolean(chips_.length)} chips={chips_} />
        </Box>
        <StyledCollapse in={allocatableEquipments.length > 0}>
          <Typography variant='subtitle2'>
            {allocatableEquipments.length} {allocatableEquipments.length > 1 ? 'containers' : 'container'} allocated
          </Typography>
          <Box display='flex' flexDirection='row' gap={2}>
            {
              allocatableEquipments?.map((equipment) => (
                <StyledChip
                  key={equipment.id}
                  chipLabel={equipment.id}
                  onDelete={() => handleRowClick(equipment)}
                />
              ))
            }
          </Box>
        </StyledCollapse>
      </Box>
      <Box display='flex' flexDirection='column' overflow='hidden' height={'45vh'}>
        {
          ENABLE_DATAGRID
            ? <AllocateDatagrid
                loading={loading}
                rowData={filteredContainerAllocs.containerAllocs}
                selectedIds={allocatableEquipments.map((a) => a.id)}
                onSelectionChange={handleDatagridSelectionChange}
              />
            : <GenericTable
                size='small'
                singleSelect
                headerCells={containerHeadCells}
                orderBy='idleDays'
                order='desc'
                rows={filteredContainerAllocs.containerAllocs}
                selected={[]}
                rowComponent={({ ...container }: ContainerRowProps) => (
                  <ContainerRow
                    {...container}
                    key={container.id}
                    handleRowClick={() => handleRowClick({ id: container.id, equipmentId: container.equipmentId || '' })}
                    isSelected={isSelected(container.equipmentId || '')}
                    noActions={true}
                  />
                )}
              />
        }
      </Box>
    </Box>
  )
}

export default AllocateContainerForm
