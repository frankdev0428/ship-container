import React, { useEffect, useMemo, useState } from 'react'
import { Box, IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import EditIcon from '@mui/icons-material/Edit'
import { DataGridPro, GridColDef, GridToolbarColumnsButton, useGridApiRef } from '@mui/x-data-grid-pro'

import { AppState } from '../../../../store'
import Typography from '../../Utils/Typography'
import { CurrentLease } from '../../../../services/lease/types'
import { TableHeadCell } from '../../../../store/ui/types'
import GenericTable from '../../shared/GenericTable/Table'
import { filterOrders } from '../../Orders/Filter/utils'
import { ENABLE_DATAGRID } from '../../../globals'
import { setDatagridState } from '../../../../store/ui/actions'
import { getTimeLabel, setDefaultsDataGridState } from '../../shared/utils'
import { ChangeAllocationStatus } from '../../Orders/OrderCollapsedData/Allocations'
import { CustomOverflowValue } from '../../shared/CustomOverflowValue'

import EditAllocationDialog from './EditAllocationDialog'
import AllocationRow, { AllocationRowDataProps, AllocationRowProps, mapToAllocationRow } from './AllocationRow'

interface NoDataProps {
  searchFilter?: string;
}

const NoData = ({ searchFilter }: NoDataProps) => {
  return (
    <Box margin={'4px auto'} width='80%'>
      <Typography align='center' variant='subtitle2'>
        { searchFilter !== ''
          ? 'There are no allocations matching your search filter.'
          : 'There are no allocations yet.'
        }
        </Typography>
    </Box>
  )
}

const allocationTableHeadCells: TableHeadCell[] = [
  { id: 'id', isSortable: true, label: 'Order Nº', hide: false },
  { id: 'customer', isSortable: true, label: 'Customer', hide: false },
  { id: 'origin', isSortable: true, label: 'Collection Location', hide: false },
  { id: 'executionDate', isSortable: true, label: 'Collection Date', hide: false },
  { id: 'destination', isSortable: true, label: 'Return Location', hide: false },
  { id: 'returnDate', isSortable: true, label: 'Return Date', hide: false },
  { id: 'units', isSortable: true, label: 'Cont. Quantity', hide: false },
  { id: 'comment', isSortable: false, label: 'Comment', hide: false },
  // { id: 'allocatedContainers', isSortable: true, label: 'Cont. Allocated', hide: false },
  { id: 'actions', isSortable: true, align: 'center', label: null, width: 80 },
]

interface AllocationTableProps {
  equipmentId: string;
  leases: CurrentLease[];
}

const AllocationTable = ({ equipmentId, leases }: AllocationTableProps) => {
  const apiRef = useGridApiRef()
  const [editId, setEditId] = useState<null | string>(null)
  const { companies } = useSelector((state: AppState) => state.company)
  const { facilities, locations } = useSelector((state: AppState) => state.places)

  const { allocations, loadingStatus: loadingEquipments } = useSelector((state: AppState) => state.equipment)
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)

  const filteredAllocations = allocations.filter(m => m.equipmentId === equipmentId)
    ?.sort((a, b) => b.equipmentlease?.executionDate?.getTime() || 0 - (a.equipmentlease?.executionDate?.getTime() || 0))
    .map(m => mapToAllocationRow(m, companies, facilities, leases)) || []

  const handleCloseDialog = () => {
    setEditId(null)
  }

  const columns = useMemo(() => [
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      hideable: false,
      filterable: false,
      minWidth: 122,
      renderHeader: () => (
        <GridToolbarColumnsButton style={{ minWidth: 36 }} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
      ),
      renderCell: (params:{row: AllocationRowDataProps}) => {
        return (
          <>
            <IconButton disabled size='small' color='primary' onClick={(e) => {
              e.stopPropagation()
              e?.preventDefault()
              setEditId(params.row.contractId)
            }}>
              <EditIcon/>
            </IconButton>
            {
              params.row.active !== undefined &&
                <ChangeAllocationStatus disabled row={{ isActiveAllocation: params.row.active, contractId: params.row.contractId }} />
            }
          </>
        )
      },
      flex: 0.5,
    },
    {
      field: 'id',
      headerName: 'Order Nº',
      renderCell: (params:{row: AllocationRowDataProps}) => (
        <CustomOverflowValue dataKey={'containersAllocation'} value={params.row.id} isLink to={`/ecosystem/fleet-management/orders?orderId=${params.row.id}`}/>

      ),
      flex: 1,
    },
    {
      field: 'customer',
      headerName: 'Customer',
      renderCell: (params:{row: AllocationRowDataProps}) => (
        <CustomOverflowValue dataKey={'containersAllocation'} value={params.row.customer} />
      ),
      flex: 1,
    },
    {
      field: 'origin',
      headerName: 'Collection Location',
      renderCell: (params:{row: AllocationRowDataProps}) => (
        <CustomOverflowValue dataKey={'containersAllocation'} value={params.row.origin} />
      ),
      flex: 1,
    },
    {
      field: 'executionDate',
      headerName: 'Collection Date',
      renderCell: (params: {row: AllocationRowDataProps}) => (
        <CustomOverflowValue dataKey={'containersAllocation'} value={params.row.executionDate ? getTimeLabel(params.row.executionDate) : undefined} />
      ),
      flex: 1,
    },
    {
      field: 'destination',
      headerName: 'Return Location',
      renderCell: (params: {row: AllocationRowDataProps}) => (
        <CustomOverflowValue dataKey={'containersAllocation'} value={params.row.destination}/>
      ),
      flex: 1,
    },
    {
      field: 'returnDate',
      headerName: 'Return Date',
      renderCell: (params: {row: AllocationRowDataProps}) => (
        <CustomOverflowValue dataKey={'containersAllocation'} value={params.row.returnDate ? getTimeLabel(params.row.returnDate) : undefined} />
      ),
      flex: 1,
    },
    {
      field: 'units',
      headerName: 'Cont. Quantity',
      renderCell: (params:{row: AllocationRowDataProps}) => (
        <CustomOverflowValue dataKey={'containersAllocation'} value={params.row.units} />
      ),
      flex: 1,
    },
    {
      field: 'comment',
      headerName: 'Comment',
      renderCell: (params:{row: AllocationRowDataProps}) => (
        <CustomOverflowValue dataKey={'containersAllocation'} value={params.row.comment} />
      ),
      flex: 1,
    },
  ] as GridColDef[],
  [])

  useEffect(() => {
    if (ENABLE_DATAGRID && datagridState?.containersAllocation) {
      apiRef.current.restoreState(setDefaultsDataGridState(datagridState.containersAllocation))
    }
  }, [])

  const _dispatch = useDispatch()

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, containersAllocation: columnState }))
  }

  const editAllocation = allocations.find(a => a.equipmentLeaseContractId === editId)

  return (
    <Box id='allocations-table-wrapper' sx={{ overflowY: 'auto' }} display='flex' flexDirection={'column'} maxHeight='40vh' >
        <Box display='flex' flexDirection='column' overflow='hidden' height={'40vh'}>
          { ENABLE_DATAGRID
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
              rows={ filteredAllocations }
              getRowId={ row => row.id }
            />
            : <GenericTable
              headerCells={allocationTableHeadCells}
              order={'desc'}
              orderBy={'executionDate'}
              rows={filteredAllocations}
              handleSelectAllClick={() => {}}
              searchBy={filterOrders}
              searchPlaceholder={'Search orders...'}
              disableSelect
              rowComponent={({ ...row }: AllocationRowProps) => (
                <AllocationRow
                  {...row}
                  key={row.id}
                  linkTo={true}
                  onEdit={setEditId}
                />
              )}
              noDataComponent={(searchFilter: string) => <NoData searchFilter={searchFilter} />}
              loading={loadingEquipments}
            />
          }
        </Box>
        {editAllocation && <EditAllocationDialog allocation={editAllocation} handleClose={handleCloseDialog} />}
    </Box>
  )
}

export default AllocationTable
