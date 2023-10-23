import React, { useEffect, useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'
import { useDispatch, useSelector } from 'react-redux'
import { DataGridPro, GridColDef, GridToolbarColumnsButton, useGridApiRef } from '@mui/x-data-grid-pro'

import UpdateStatus from '../../Containers/Status/UpdateStatus'
import { ColoredDot } from '../../shared/ColoredDot'
import ContainerRow, { ContainerRowDataProps, ContainerRowProps, mapToContainerRow, showAvailableFrom, showAvailableTo, useContainerStatusMap } from '../AllocationRow'
import NewVisContract from '../VisContract/NewVisContract'
import { toggleLease } from '../../../../services/thunks'
import TipIconButton from '../../shared/TipIconButton'
import { getTimeLabel, setDefaultsDataGridState } from '../../shared/utils'
import { AppState } from '../../../../store'
import { ENABLE_DATAGRID } from '../../../globals'
import GenericTable from '../../shared/GenericTable/Table'
import { setDatagridState } from '../../../../store/ui/actions'
import { EquipmentLeaseContract } from '../../../../services/lease/types'
import { TableHeadCell } from '../../shared/GenericTable/SortableTableHead'
import { filterContainers } from '../../Containers/Filter/utils'
import { CustomOverflowValue } from '../../shared/CustomOverflowValue'

export const inititalContainerHeadCells: TableHeadCell[] = [
  { id: 'id', isSortable: true, label: 'Container Nº', hide: false, width: 200 },
  { id: 'operationalStatus', isSortable: true, label: 'Status', hide: false },
  { id: 'allocFromPlanned', isSortable: true, label: 'Alloc. from', hide: false },
  { id: 'allocToPlanned', isSortable: true, label: 'Alloc. until', hide: false },
  { id: 'returnLocation', isSortable: true, label: 'Return location', hide: false },
  { id: 'availableFrom', isSortable: true, label: 'Avail. from', hide: false },
  { id: 'availableTo', isSortable: true, label: 'Avail. until', hide: false },
  { id: 'idleDays', isSortable: true, label: 'Idle time', hide: false },
  // { id: 'idleCost', isSortable: true, label: 'Idle cost', hide: false },
  // { id: 'idleCostForecast', isSortable: true, label: 'Idle Cost Forecast', hide: false },
  // { id: 'leaseRevenue', isSortable: true, label: 'Lease Revenue', hide: false },
  // { id: 'leasesRevenueForecast', isSortable: true, label: 'Leases Revenue Forecast', hide: false },
  // { id: 'customer', isSortable: true, label: 'Customer', hide: false },
  // { id: 'orderId', isSortable: true, label: 'Order', hide: false },
  { id: 'currentLocation', isSortable: true, label: 'Location', hide: false },
  { id: 'containerVersion', isSortable: true, label: 'Version', hide: true },
  { id: 'containerCertificateDate', isSortable: true, label: 'Cert. Date', hide: true },
  { id: 'containerDoorType', isSortable: true, label: 'TIR locking plate', hide: false },
  { id: 'containerFloorType', isSortable: true, label: 'Floor insulation', hide: false },
  { id: 'comment', isSortable: true, label: 'Comment', hide: false },
  // { id: 'destinationLocation', isSortable: true, label: 'Destination', hide: false },
  // { id: 'alerts', isSortable: false, label: 'Alerts', hide: false },
  { id: 'actions', isSortable: false, align: 'center', label: null, width: 118 },
]

interface NoDataProps {
  searchFilter?: string;
}

const NoData = ({ searchFilter }: NoDataProps) => {
  return (
    <Box margin={'4px auto'} width='80%'>
      <Typography align='center' variant='subtitle2'>
        {
          searchFilter !== ''
            ? 'There are no allocations matching your search filter.'
            : 'There are no allocations yet.'
        }
        </Typography>
    </Box>
  )
}

export const ChangeAllocationStatus = ({ row, disabled }: { row: { isActiveAllocation?: boolean, contractId?: string }, disabled?: boolean }): JSX.Element => {
  const [isActive, setIsActive] = useState(row.isActiveAllocation)

  const _dispatch = useDispatch()

  const handleToggle = (contractId?: string) => {
    if (contractId) {
      _dispatch(toggleLease(contractId, () => {
        setIsActive(!isActive)
      }))
    }
  }

  return (
    <TipIconButton
      size='small'
      disabled={disabled}
      title={isActive ? 'Cancel' : 'Restore' }
      onClick={() => handleToggle(row.contractId)}
    >
      { isActive
        ? <CancelIcon color='error' {...disabled && { color: 'disabled' }} />
        : <SettingsBackupRestoreIcon color='primary' {...disabled && { color: 'disabled' }} />
      }
    </TipIconButton>
  )
}

interface OrderAllocationProps {
  leaseContracts?: EquipmentLeaseContract[];
}

const Allocations = ({ leaseContracts }: OrderAllocationProps): JSX.Element => {
  const equipments = useSelector((state: AppState) => state.equipment.equipments)
  const loadingStatus = useSelector((state: AppState) => state.equipment.loadingStatus)
  const companies = useSelector((state: AppState) => state.company.companies)
  const facilities = useSelector((state: AppState) => state.places.facilities)
  const storage = useSelector((state: AppState) => state.financials.storage)
  const lease = useSelector((state: AppState) => state.financials.lease)
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)
  const { shouldUseBackend } = useSelector((state: AppState) => state.settings)

  const statusMap = useContainerStatusMap()
  const apiRef = useGridApiRef()
  const _dispatch = useDispatch()

  useEffect(() => {
    if (ENABLE_DATAGRID && datagridState?.ordersAllocation && apiRef?.current?.restoreState) {
      apiRef.current.restoreState(setDefaultsDataGridState(datagridState.ordersAllocation))
    }
  }, [])

  const filteredEquipments = useMemo(() => {
    return leaseContracts?.map(lc => {
      const e = equipments.find(e => lc.equipmentId === e.equipmentId)
      if (!e) return undefined
      const eMapped = mapToContainerRow(e, companies, facilities, storage, lease, lc, shouldUseBackend)
      return {
        ...eMapped,
        isActiveAllocation: lc.active,
        contractId: lc.equipmentLeaseContractId,
      }
    }).filter(lc => lc !== undefined)
  },
  // leaseContracts should not be a big array so not a major concern to have it as a dependency
  // if and when it becomes too big, we should handle this dependency differently
  [JSON.stringify(leaseContracts), loadingStatus, equipments.length])

  const columns = useMemo(() => {
    const columns = [
      {
        field: 'actions',
        hideable: false,
        sortable: false,
        minWidth: 122,
        headerName: 'Actions',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <Box display='flex' alignItems={'center'} justifyContent={'space-between'} >
            <UpdateStatus
              equipmentLeaseContractId={params.row.leaseContractId || ''}
              containerId={params.row.id} equipmentId={params.row.equipmentId || ''}
              statusId={params.row.leaseContractId || ''}
              status={params.row.blockingStatuses?.find(s => s.equipmentLeaseContractId === params.row.currentStatus?.equipmentLeaseContractId) || params.row.currentStatus}
              comment={params.row.comment}
              // isActive={params.row.isActiveAllocation}
            />
            <NewVisContract equipmentLeaseContractId={params.row.leaseContractId || ''}/>
            { params.row.isActiveAllocation !== undefined && <ChangeAllocationStatus row={ params.row } />}
          </Box>
        ),
        renderHeader: () => (
          <GridToolbarColumnsButton style={{ minWidth: 36 }} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
        ),
      },
      {
        field: 'id',
        headerName: 'Container Nº',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue
            dataKey={'ordersAllocation'}
            value={params.row.id}
            isLink
            to={`/ecosystem/fleet-management/containers?containerId=${params.row.id}`}
          />
        ),
        minWidth: 200,
      },
      {
        field: 'operationalStatus',
        headerName: 'Status',
        renderCell: (params: {row: ContainerRowDataProps}) => {
          return (
            <Box display='flex' alignItems='center' overflow='hidden'>
              <ColoredDot color={statusMap.get(params.row.status)?.color} />
              <CustomOverflowValue dataKey={'ordersAllocation'} value={statusMap.get(params.row.status)?.label} />
            </Box>
          )
        },
        flex: 1,
      },
      {
        field: 'allocFromPlanned',
        headerName: 'Alloc. from',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue
            dataKey={'ordersAllocation'}
            value={params.row.allocFromPlanned ? getTimeLabel(params.row.allocFromPlanned, 'dateHourWithTz') : undefined}
          />
        ),
        flex: 1,
      },
      {
        field: 'allocToPlanned',
        headerName: 'Alloc. until',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue
            dataKey={'ordersAllocation'}
            value={params.row.allocToPlanned ? getTimeLabel(params.row.allocToPlanned, 'dateHourWithTz') : undefined}
          />
        ),
        flex: 1,
      },
      {
        field: 'returnLocation',
        headerName: 'Return location',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'ordersAllocation'} value={params.row.returnLocation} />
        ),
        flex: 1,
      },
      {
        field: 'availableFrom',
        headerName: 'Avail. from',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          showAvailableFrom(params.row.availableFrom)
        ),
        flex: 1,
      },
      {
        field: 'availableTo',
        headerName: 'Avail. until',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          showAvailableTo(params.row.availableFrom, params.row.availableTo)
        ),
        flex: 1,
      },
      {
        field: 'idleDays',
        headerName: 'Idle time',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'ordersAllocation'} value={params.row.idleDays} />
        ),
        flex: 1,
      },
      {
        field: 'currentLocation',
        headerName: 'Location',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'ordersAllocation'} value={params.row.currentLocation } />
        ),
        flex: 1,
      },
      {
        field: 'containerVersion',
        headerName: 'Version',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'ordersAllocation'} value={params.row.containerVersion} />
        ),
        flex: 1,
      },
      {
        field: 'containerCertificateDate',
        headerName: 'Cert. Date',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue
            dataKey={'ordersAllocation'}
            value={params.row.containerCertificateDate ? getTimeLabel(params.row.containerCertificateDate, 'dateHourWithTz') : undefined}
          />
        ),
        flex: 1,
      },
      {
        field: 'containerDoorType',
        headerName: 'TIR locking plate',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'ordersAllocation'} value={params.row.containerDoorType} />
        ),
        flex: 1,
      },
      {
        field: 'containerFloorType',
        headerName: 'Floor insulation',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'ordersAllocation'} value={params.row.containerFloorType} />
        ),
        flex: 1,
      },
      {
        field: 'comment',
        headerName: 'Comment',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'ordersAllocation'} value={params.row.comment } />
        ),
        flex: 1,
      },
    ] as GridColDef[]

    if (datagridState?.ordersAllocation && apiRef?.current?.exportState) {
      const columnState = apiRef.current.exportState()
      if (columnState?.columns?.orderedFields) {
        const indexedColumns = columns.reduce((indexed, column) => {
          return {
            ...indexed,
            ...column.field && { [column.field]: column },
          }
        }, {} as { [x: string]: GridColDef })

        return columnState.columns.orderedFields.map(fieldName => indexedColumns[fieldName])
      }
    }

    return columns
  },

  [apiRef?.current?.instanceId])

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, ordersAllocation: columnState }))
  }

  return (
    <Box display='flex' flexDirection='column' overflow='hidden' height={'100vh'} /* We can have 100vh because the parent will limit it to 50vh */ >
      {
        ENABLE_DATAGRID
          ? <DataGridPro
            apiRef={ apiRef }
            initialState={{ columns: { columnVisibilityModel: {} } }}
            localeText={{ toolbarColumns: '' }}
            disableSelectionOnClick
            onColumnOrderChange={ handleDispatch }
            onColumnVisibilityModelChange={ handleDispatch }
            onColumnWidthChange={ handleDispatch }
            onPinnedColumnsChange={ handleDispatch }
            onSortModelChange={ handleDispatch }
            columns={ columns }
            rows={ filteredEquipments || [] }
            getRowId={ row => row.id }
          />
          : <GenericTable
            headerCells={inititalContainerHeadCells}
            order={'asc'}
            orderBy={'id'}
            rows={filteredEquipments}
            handleSelectAllClick={() => {}}
            searchBy={filterContainers}
            searchPlaceholder={'Search containers...'}
            disableSelect
            noDataComponent={(searchFilter: string) => <NoData searchFilter={searchFilter} />}
            rowComponent={({ ...row }: ContainerRowProps) => (
              <ContainerRow
                {...row}
                headerCells={inititalContainerHeadCells}
                // handleRowClick={handleRowClick}
                // isSelected={isSelected(row.id)}
                // onDismissAlerts={handleDismissAlerts}
                // handleCreateMove={handleCreateMove}
                // equipmentsWithLeases={equipmentsWithLeases}
                noCollapse={true}
              />
            )}
          />
      }
    </Box>
  )
}

export default Allocations
