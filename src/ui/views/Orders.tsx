import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Box, Button, CircularProgress, IconButton, Zoom, Grid, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import {
  DataGridPro, GridColDef, gridDetailPanelExpandedRowsContentCacheSelector, GridRenderCellParams, GRID_CHECKBOX_SELECTION_COL_DEF, GRID_DETAIL_PANEL_TOGGLE_COL_DEF, useGridSelector, useGridApiRef, GridToolbarColumnsButton, GridSelectionModel,
  GridToolbarContainer,
  useGridApiContext,
  GridRowParams,
} from '@mui/x-data-grid-pro'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { AppState } from '../../store'
import { SortByUI, TableHeadCell } from '../../store/ui/types'
import { setDatagridState, setOrderColumns, setOrderFilters, setOrderSortBy, setOrderViewTab } from '../../store/ui/actions'
import { createLease, createLeaseStatus, listLeases, sendBookingEmail } from '../../services/lease/actions'
import { Lease, OrderStatusEnum, EquipmentLeaseInput } from '../../services/lease/types'
import { listCompanies } from '../../services/customer/actions'
import { listFacilities } from '../../services/places/actions'
import GenericTable from '../components/shared/GenericTable/Table'
import OrderRow, { mapToOrderRow, OrderRowDataProps, OrderRowProps, useOrderStatusMap } from '../components/Orders/OrderRow'
import NewOrder from '../components/Orders/NewOrder'
import EndOrder from '../components/Orders/Status/EndOrder'
import FilterColumns from '../components/shared/GenericTable/FilterColumns'
import { allocateContainers, createOrderWithStatus } from '../../services/thunks'
import { genericHandleSelectAllClick, genericHandleRowClick } from '../components/shared/GenericTable/utils'
import { filterOrders, getOrderOptions, orderFilter, orderOptions } from '../components/Orders/Filter/utils'
import Typography, { DisableableTypography } from '../components/Utils/Typography'
import FilterButton, { applyFilter, FilterChip, StateFilter } from '../components/shared/Filter/FilterButton'
import CollapsibleChips from '../components/shared/Filter/CollapsibleChips'
import Searchbar from '../components/shared/Search'
import { showError } from '../../store/error/actions'
import Allocate from '../components/Orders/Allocate'
import { ENABLED_NEW_ORDER_DIALOG_REFACTORED, getStatusButtonMinWidth, getTimeLabel, setDefaultsDataGridState } from '../components/shared/utils'
import TableActions, { TableAction } from '../components/shared/GenericTable/TableActions'
import { ColoredDot } from '../components/shared/ColoredDot'
import OrderData from '../components/Orders/OrderCollapsedData/OrderData'
import DeleteOrder from '../components/Orders/DeleteOrder'
import PatchOrder from '../components/Orders/PatchOrder'
import theme from '../styles/coriolis-theme'
import { ENABLE_DATAGRID } from '../globals'
import { CustomOverflowValue } from '../components/shared/CustomOverflowValue'
import NewOrderButton from '../components/Orders/NewOrder/NewOrderButton'

export const inititalOrderHeadCells: TableHeadCell[] = [
  { id: 'id', isSortable: true, label: 'Order Nº', hide: false, width: 270 },
  { id: 'createdAt', isSortable: true, label: 'Created at', hide: false },
  { id: 'orderStatus', isSortable: true, label: 'Status', hide: false },
  { id: 'customer', isSortable: true, label: 'Customer', hide: false },
  { id: 'contractStatus', isSortable: true, label: 'Lease type', hide: false },
  { id: 'origin', isSortable: true, label: 'Collection Location', hide: false },
  { id: 'executionDate', isSortable: true, label: 'Collection Date', hide: false },
  { id: 'destination', isSortable: true, label: 'Return Location', hide: false },
  { id: 'returnDate', isSortable: true, label: 'Return Date', hide: false },
  { id: 'units', isSortable: true, label: 'Cont. Quantity', hide: false },
  { id: 'allocatedContainers', isSortable: true, label: 'Cont. Allocated', hide: false },
  { id: 'customersBookingNumber', isSortable: true, label: 'BKG number', hide: false },
  { id: 'actions', isSortable: false, align: 'center', label: <FilterColumns type='order' size='small' />, hide: false, width: 100 },
]

const orderStatusMap = new Map([
  ['ONGOING', ['ONGOING', 'OUTDATED']],
  ['READY', ['READY']],
  ['ACCEPTED', ['ACCEPTED']],
  ['CREATED', ['CREATED']],
  ['COMPLETED', ['AELER-CANCELED', 'CUSTOMER-CANCELED', 'COMPLETED-FULFILLED', 'COMPLETED-FAILED']],
  ['ALL', ['CREATED', 'ACCEPTED', 'AELER-CANCELED', 'CUSTOMER-CANCELED', 'COMPLETED-FULFILLED', 'COMPLETED-FAILED', 'READY', 'ONGOING', 'OUTDATED']],
])

let ordersSelected: string[] = []

const StyledNoDataBox = styled(Box)({
  width: '100%',
  boxShadow: '0 2px 4px - 1px rgba(0, 0, 0, 0.2), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 4px 5px 0 rgba(0, 0, 0, 0.14)',
  backgroundColor: 'var(--N0 - white)',
  borderRadius: '10px',
  margin: '0 auto',
})

interface NoDataProps {
  status: 'ongoing' | 'ready' | 'accepted' | 'created' | 'completed' | 'all'
  numOfFilters: number
  totalNum: number;
  searchFilter?: string;
}

const NoOrderData = ({ status, numOfFilters, totalNum, searchFilter }: NoDataProps) => {
  let heading, text

  if (totalNum === 0) {
    heading = 'You don\'t have any orders on your list yet.'
    text = `Usually, this is a permission issue.
        If you believe you should have access to some orders' data, contact AELER support.`
  } else {
    const hasFilters = numOfFilters === 0 || searchFilter !== ''
    const extraText = hasFilters ? ' that match your filters' : ''
    switch (status) {
      case 'ongoing':
        heading = `You don't have any ongoing orders ${extraText}.`
        text = 'If you believe you should have access to some orders\' data, contact AELER support.'
        break
      case 'ready':
        heading = `You don't have any ready orders ${extraText}.`
        text = 'If you believe you should have access to some orders\' data, contact AELER support.'
        break
      case 'accepted':
        heading = `You don't have any accepted orders ${extraText}.`
        text = 'If you believe you should have access to some orders\' data, contact AELER support.'
        break
      case 'created':
        heading = `You don't have any created orders ${extraText}.`
        text = 'If you believe you should have access to some orders\' data, contact AELER support.'
        break
      case 'completed':
        heading = `You don't have any completed orders${extraText}.`
        text = 'If you believe you should have access to some orders\' data, contact AELER support.'
        break
      default:
        heading = `You don't have any orders ${hasFilters ? 'that match your filters' : 'in your list yet'}.`
        text = 'If you believe you should have access to some orders\' data, contact AELER support.'
    }
  }

  return (
    <StyledNoDataBox>
      <Box m={'50px 24px'} textAlign='center'>
        <Typography paragraph>
          {heading}
        </Typography>
        <Typography>
          {text}
        </Typography>
      </Box>
    </StyledNoDataBox>
  )
}

type GridToolbarCustomProps = {
  selected: string[];
  orderActions: TableAction[];
}

export const GridToolbarCustom = ({ selected, orderActions }: GridToolbarCustomProps) => {
  return (
      <GridToolbarContainer>
        {/* <Grid container item xs>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </Grid> */}

        <Grid container justifyContent="flex-end">
          <Grid item>
            <TableActions actions={orderActions} selectedIds={selected} disabled={selected.length === 0} />
          </Grid>
        </Grid>
      </GridToolbarContainer>
  )
}

// function for customizing the master detail icon
function CustomDetailPanelToggle(props: Pick<GridRenderCellParams, 'id' | 'value'>) {
  const { id, value: isExpanded } = props
  const apiRef = useGridApiContext()
  // To avoid calling ´getDetailPanelContent` all the time, the following selector
  // gives an object with the detail panel content for each row id.
  const contentCache = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowsContentCacheSelector,
  )

  return (
      <IconButton size='small' color='primary'>
        { isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
  )
}

function DetailPanelContent({ row }: { row: OrderRowDataProps }) {
  const apiRef = useGridApiContext()
  const [width, setWidth] = React.useState(() => {
    if (apiRef.current.getRootDimensions) {
      const dimensions = apiRef.current.getRootDimensions()
      return dimensions ? dimensions.viewportInnerSize.width : undefined
    }
  })

  const handleViewportInnerSizeChange = useCallback(() => {
    if (apiRef.current.getRootDimensions) {
      const dimensions = apiRef.current.getRootDimensions()
      dimensions && setWidth(dimensions.viewportInnerSize.width)
    }
  }, [apiRef])

  useEffect(() => {
    return apiRef.current.subscribeEvent(
      'viewportInnerSizeChange',
      handleViewportInnerSizeChange,
    )
  }, [apiRef, handleViewportInnerSizeChange])

  return (

    <Box
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: '#f9f9fb',
      }}
    >
      <Stack
        sx={{
          px: 2,
          height: '100%',
          boxSizing: 'border-box',
          position: 'sticky',
          left: 0,
          width: width || '100%',
          minWidth: 860,
          backgroundColor: '#f9f9fb',
        }}
        direction="column"
      >
        <OrderData orderId={row.id || '' } leaseContracts={row.leaseContracts} />
      </Stack>
    </Box>
  )
}

interface ContainerByStatusProps {
   loading: boolean;
   orders: OrderRowDataProps[];
   filteredOrders: OrderRowDataProps[];
   selectedOrders: string[];
   numOfFilters: number;
   orderActions: TableAction[];

   setSelected: (s: string[]) => void;
}

const OrdersByStatus = ({ loading, orders, filteredOrders, selectedOrders, numOfFilters, orderActions, setSelected } : ContainerByStatusProps) => {
  const apiRef = useGridApiRef()

  const statusTab = useSelector((state: AppState) => state.ui.orderStatusTab)

  const totalOrders = statusTab === 'ALL' ? orders : orders.filter(o => o.orderStatus && orderStatusMap.get(statusTab)?.includes(o.orderStatus))
  const ordersByStatus = statusTab === 'ALL' ? filteredOrders : filteredOrders.filter(o => o.orderStatus && orderStatusMap.get(statusTab)?.includes(o.orderStatus))

  const buttons = Array.from(orderStatusMap.keys())
  const totalLabel = `${ordersByStatus.length} / ${totalOrders.length}`

  const _dispatch = useDispatch()

  // const orderTableHeadCells = useSelector((state: AppState) => state.ui.orderTableHeadCells)
  const orderSortBy = useSelector((state: AppState) => state.ui.orderSortBy)

  const handleChangeStatus = (status: string) => () => {
    _dispatch(setOrderViewTab(status))
  }

  const handleSelectAllClick = genericHandleSelectAllClick(ordersByStatus, setSelected)
  const handleRowClick = genericHandleRowClick(selectedOrders, setSelected)

  const statusMap = useOrderStatusMap()

  // const [pageSize, setPageSize] = useState(25)

  const orderTableHeadCells = useSelector((state: AppState) => state.ui.orderTableHeadCells)

  const datagridState = useSelector((state: AppState) => state.ui.datagridState)

  const ordersData: Partial<OrderRowDataProps>[] = []
  ordersByStatus.map((elm) => ordersData.push(elm))
  const isSelected = (id: string) => selectedOrders.indexOf(id) !== -1

  const columns = useMemo(() => [
    // Column for the Master Detail
    {
      ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
      headerName: 'Expand/Collapse',
      hideable: false,
      renderCell: (params: {row: OrderRowDataProps, id: string, value: any}) => (
        <CustomDetailPanelToggle id={params.id} value={params.value} />
      ),
      renderHeader: () => (
        <GridToolbarColumnsButton style={{ minWidth: 36 }} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
      ),
    },
    // Column for the Checkbox
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      headerName: 'Checkbox',
      hideable: false,
    },
    {
      field: 'id',
      headerName: 'Order Nº',
      minWidth: 200,
      renderCell: (params: {row: OrderRowDataProps}) => (
        params.row.isNewlyInserted === true
          ? <div>
            <span style={{
              background: theme.palette.primary.highlight,
              color: 'white',
              borderRadius: 5,
              padding: 3,
              fontSize: 10,
              marginRight: 3,
              position: 'absolute',
              marginTop: -36,
              marginLeft: -8,
              zIndex: 100,
            }}>
              New
            </span>
            { params.row.id }
          </div>
          : <Box display='flex' alignItems='center'>
            { params.row.id }
          </Box>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      renderCell: (params: {row: OrderRowDataProps}) =>
        <CustomOverflowValue dataKey={'orders'} value={params.row.createdAt ? getTimeLabel(params.row.createdAt, 'dateHourWithTz') : undefined}/>,
    },
    {
      field: 'orderStatus',
      headerName: 'Status',
      renderCell: (params: {row: OrderRowDataProps}) => (
        <Box display='flex' alignItems='center' overflow='hidden'>
          <ColoredDot color={statusMap.get(params.row.orderStatus)?.color} />
          <CustomOverflowValue dataKey={'orders'} value={statusMap.get(params.row.orderStatus)?.label}/>
        </Box>
      ),
    },
    {
      field: 'customer',
      headerName: 'Customer',
      renderCell: (params: {row: OrderRowDataProps}) =>
        <CustomOverflowValue dataKey={'orders'} value={params.row.customer}/>,
    },
    {
      field: 'contractStatus',
      headerName: 'Lease type',
      renderCell: (params: {row: OrderRowDataProps}) =>
        <CustomOverflowValue dataKey={'orders'} value={params.row.contractStatus}/>,
    },
    {
      field: 'origin',
      headerName: 'Collection Location',
      renderCell: (params: {row: OrderRowDataProps}) =>
        <CustomOverflowValue dataKey={'orders'} value={params.row.origin}/>,
    },
    {
      field: 'executionDate',
      headerName: 'Collection Date',
      renderCell: (params: {row: OrderRowDataProps}) =>
        <CustomOverflowValue dataKey={'orders'} value={params.row.executionDate ? getTimeLabel(params.row.executionDate) : undefined}/>,
    },
    {
      field: 'destination',
      headerName: 'Return Location',
      renderCell: (params: {row: OrderRowDataProps}) =>
        <CustomOverflowValue dataKey={'orders'} value={params.row.destination}/>,
    },
    {
      field: 'returnDate',
      headerName: 'Return Date',
      renderCell: (params: {row: OrderRowDataProps}) =>
        <CustomOverflowValue dataKey={'orders'} value={params.row.returnDate ? getTimeLabel(params.row.returnDate) : undefined}/>,
    },
    {
      field: 'units',
      headerName: 'Cont. Quantity',
      renderCell: (params: {row: OrderRowDataProps}) =>
        <CustomOverflowValue dataKey={'orders'} value={params.row.units}/>,
    },
    {
      field: 'allocatedContainers',
      headerName: 'Cont. Allocated',
      renderCell: (params: {row: OrderRowDataProps}) =>
        <CustomOverflowValue dataKey={'orders'} value={params.row.allocatedContainers}/>,
    },
    {
      field: 'customersBookingNumber',
      headerName: 'BKG number',
      renderCell: (params: {row: OrderRowDataProps}) =>
        <CustomOverflowValue dataKey={'orders'} value={params.row.customersBookingNumber}/>,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      hideable: false,
      minWidth: 70,
      renderCell: (params: {row: OrderRowDataProps}) => (
        <Box display='flex' alignItems={'center'} justifyContent={'space-between'} >
          <DeleteOrder orderId={params.row.id} disabled={params.row.allocatedContainers > 0}/>
          <PatchOrder patchOrder={{
            orderId: params.row.id,
            returnDate: params.row.returnDate,
            executionDate: params.row.executionDate,
            units: params.row.units,
            customersBookingNumber: params.row.customersBookingNumber,
            pickupLocation: params.row.originId,
            dropoffLocation: params.row.destinationId,
            status: params.row.orderStatus,
          }}/>
        </Box>
      ),
    },
  ] as GridColDef[],
  [])

  useEffect(() => {
    if (ENABLE_DATAGRID && datagridState?.orders) {
      apiRef.current.restoreState(setDefaultsDataGridState(datagridState.orders))
      apiRef.current.setSelectionModel(selectedOrders)
    }
  }, [])

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, orders: columnState }))
  }

  const getDetailPanelHeight = React.useCallback(() => 'auto' as const, [])
  const getDetailPanelContent = React.useCallback(({ row }: GridRowParams) => <DetailPanelContent row={row} />, [])

  return (
    <>
      <Box display='flex' mb={1} ml={-1} mr={1}>
        <Box display='flex' flexGrow={1}>
          {buttons.map((status) => <Button
            key={status}
            color='primary'
            sx={{ minWidth: getStatusButtonMinWidth(status), fontWeight: statusTab === status ? undefined : 400 }}
            onClick={handleChangeStatus(status)}
          >
            {status}
          </Button>)}
          <Zoom timeout={400} in={loading}>
            <Box display='flex' alignItems='center' height='100%' ml={2}><CircularProgress size={20} /></Box>
          </Zoom>
        </Box>
        <Box alignItems='center' display='flex'>
          <Typography variant='body2' color='primary'>{`Total: ${totalLabel}`}</Typography>
        </Box>
      </Box>
      <Box display='flex' flexDirection='column' overflow='hidden' height={'100%'}>
        { ENABLE_DATAGRID
          ? <DataGridPro
            apiRef={apiRef}
            // till MUI v6, column visibility model must be initialized for onColumnVisibilityModelChange to work
            initialState={{ columns: { columnVisibilityModel: {} } }}
            // set text on the hideColumns button
            localeText={{ toolbarColumns: '' }}
            checkboxSelection
            disableSelectionOnClick
            // Listener for when a row is selected (rowIds = the Ids of all rows selected)
            onSelectionModelChange={(rowIds) => {
              selectedOrders = []
              rowIds.map((elm) => selectedOrders.push(elm.toString()))
              ordersSelected = selectedOrders
              setSelected(ordersSelected)
            } }
            // Listener for when the column order, visibility or width changes
            onColumnOrderChange={ handleDispatch }
            onColumnVisibilityModelChange={ handleDispatch }
            onColumnWidthChange={ handleDispatch }
            onPinnedColumnsChange={ handleDispatch }
            onSortModelChange={ handleDispatch }
            columns={columns}
            rows={ordersData}
            getRowId={ row => row.id }
            getDetailPanelContent={getDetailPanelContent}
            getDetailPanelHeight={getDetailPanelHeight}
            // rowsPerPageOptions={[25, 50, 100, 200]}
            // pageSize={pageSize}
            // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            // pagination
            componentsProps={{
              toolbar: {
                selected: selectedOrders,
                orderActions: orderActions,
              },
            }}
            components={{
              Toolbar: GridToolbarCustom,
            }}
            sx={{
              '& .MuiDataGrid-detailPanel': {
                overflow: 'unset',
              },
            }}
          />
          : <GenericTable
            headerCells={orderTableHeadCells}
            order={orderSortBy.order}
            orderBy={orderSortBy.orderBy}
            setSortBy={(sortBy: SortByUI) => _dispatch(setOrderSortBy(sortBy))}
            rows={ordersByStatus}
            selected={selectedOrders}
            handleSelectAllClick={handleSelectAllClick}
            tableActions={orderActions}
            noDataComponent={(searchFilter: string) => <NoOrderData searchFilter={searchFilter} status={statusTab as any} numOfFilters={numOfFilters} totalNum={totalOrders.length} />}
            rowComponent={({ ...order }: OrderRowProps) => (
              <OrderRow
                {...order}
                key={order.id}
                handleRowClick={handleRowClick}
                isSelected={isSelected(order.id)}
              />
            )}
          />
        }
      </Box>
    </>
  )
}

export const OrdersView: React.FunctionComponent<void> = () => {
  const [selected, setSelected] = useState<string[]>([])

  const [orders, setOrders] = useState<OrderRowDataProps[]>([])
  const [filteredOrders, setFilteredOrders] = useState<{ orders: OrderRowDataProps[], numOfFilters: number}>({ orders: [], numOfFilters: 0 })
  const [searchFilter, setSearchFilter] = useState('')
  const [chips, setChips] = useState<FilterChip[] | null>(null)

  const { leases, loadingStatus: loadingLeases } = useSelector((state: AppState) => state.lease)
  const { companies, loadingStatus: loadingCompanies } = useSelector((state: AppState) => state.company)
  const { facilities, loadingStatus: loadingFacilities } = useSelector((state: AppState) => state.places)
  const allocations = useSelector((state: AppState) => state.equipment.allocations)
  const { orderFilters } = useSelector((state: AppState) => state.ui)
  const setFilters = (filters: StateFilter[]) => _dispatch(setOrderFilters(filters))
  const { shouldUseBackend } = useSelector((state: AppState) => state.settings)

  const _dispatch = useDispatch()

  useEffect(() => {
    _dispatch(listLeases({}))
    _dispatch(listCompanies({}))
    _dispatch(listFacilities({}))
  }, [])

  useEffect(() => {
    if (leases.length) setOrders(leases.map(l => mapToOrderRow(l, companies, facilities, shouldUseBackend)))
    // allocations is a dependency because of toggle. THIS SHOULD BE FIXED ASAP because it causes unnecessary rerenders
  }, [leases, companies, facilities, searchFilter, allocations, shouldUseBackend])

  const handleCreate = (order: EquipmentLeaseInput, status?: OrderStatusEnum): any => {
    if (status) {
      return _dispatch(createOrderWithStatus(order, status))
    } else {
      return _dispatch(createLease({
        lease: {
          orderId: order.orderId,
          customerId: order.customerId,
          timePlaced: order.timePlaced,
          pickupLocation: order.pickupLocation,
          dropoffLocation: order.dropoffLocation,
          returnDate: order.returnDate,
          executionDate: order.executionDate,
          units: order.units,
          customersBookingNumber: order.customersBookingNumber,
        },
        status: {
          contractStatus: order.contractStatus,
        },
      }))
    }
  }

  const handleEndOrders = (leases: Lease[], orderStatus: OrderStatusEnum) => {
    setSelected(ordersSelected)
    leases.forEach(lease => {
      _dispatch(createLeaseStatus(lease.orderId, {
        // contractStatus: (lease.orderStatus as any).contractStatus
        contractStatus: lease.equipmentleasestatuses.length > 0 ? lease.equipmentleasestatuses[lease.equipmentleasestatuses.length - 1].contractStatus : undefined as any,
        orderStatus: orderStatus as any,
      }))
    })
    // setSelected([])
  }

  const handleAllocate = (equipments: string[]) => {
    const orderId = selected.length === 1 ? selected[0] : undefined
    if (orderId) {
      _dispatch(allocateContainers(equipments, { orderId }))
    } else {
      _dispatch(showError(['Must choose one single order']))
    }

    // setSelected([])
  }

  const handleArchiveOrders = (orderIds: string[]) => {
    // TODO: add action
    // _dispatch(archiveLeases(orderIds )
  }
  const handleSendBookingEmail = (orderIds: string[]) => {
    orderIds.forEach(orderId => _dispatch(sendBookingEmail(orderId)))
  }

  const orderActions = [
    { label: (numSelected: number) => `Archive Order${numSelected > 1 ? 's' : ''}`, action: handleArchiveOrders, disabled: true },
    { label: 'Send Booking Email', action: handleSendBookingEmail, disabled: false },
  ]

  const handleSearch = (value: string) => {
    const fData = applyFilter(orders, orderFilters, orderFilter)
    const f = value !== '' ? filterOrders(fData, value) : fData
    setFilteredOrders({ orders: f, numOfFilters: filteredOrders.numOfFilters })
    setSearchFilter(value)
  }

  const handleFiltersChange = (orders: OrderRowDataProps[], chips: FilterChip[] | null) => {
    const numOfFilters = (searchFilter !== '' ? 1 : 0) + (chips ? chips.length : 0)
    setFilteredOrders({ orders: filterOrders(orders, searchFilter), numOfFilters })
    // setSelected([])
    setChips(chips)
  }

  const selectedOrderId = selected.length === 1 ? selected[0] : undefined
  const selectedOrder = leases.find(l => l.orderId === selectedOrderId)
  const selectedOrderForAllocation = selectedOrder
    ? {
        dateFrom: selectedOrder.executionDate,
        dateTo: selectedOrder.returnDate,
        facilityFrom: selectedOrder.pickupLocation,
      }
    : undefined

  return (
    <Box width='100%' id='orders-list' display='flex' flexDirection='column' >
      <Box mt={2} mb={1} display='flex' alignItems='center' flexWrap='wrap'>
        <Box flexGrow={1} display='flex' alignItems='center' flexWrap='wrap'>
          <Searchbar placeholder={'Search orders...'} filter={searchFilter} setFilter={handleSearch} clearAll={() => handleSearch('')} />
          <EndOrder ml={2} orders={leases.filter(o => selected.includes(o.orderId))} onEndOrder={handleEndOrders}/>
          <Allocate disabled={selected.length !== 1} onAllocate={handleAllocate} allocationOrder={selectedOrderForAllocation}/>
          {/* { (loadingLeases || loadingCompanies || loadingFacilities) && <CircularProgress sx={{ marginLeft: '16px' }} size={20}/> } */}
        </Box>
        {
          ENABLED_NEW_ORDER_DIALOG_REFACTORED
            ? <NewOrderButton mr={1}/>
            : <NewOrder mr={1} onCreate={handleCreate} />
        }
        <FilterButton
          // icon
          disabled={false}
          data={orders}
          dataFilter={orderFilter}
          options={orderOptions}
          getOptions={getOrderOptions}
          onFilter={handleFiltersChange}
          filters={orderFilters}
          setFilters={setFilters}
        />
      </Box>
      <Box mb={1}>
        <CollapsibleChips open={Boolean(chips?.length)} chips={chips} />
      </Box>
      <OrdersByStatus
        loading={loadingLeases || loadingCompanies || loadingFacilities}
        orders={orders}
        filteredOrders={filteredOrders.orders}
        selectedOrders={selected}
        numOfFilters={filteredOrders.numOfFilters}
        orderActions={orderActions}
        setSelected={setSelected}
      />
    </Box >
  )
}

export default OrdersView
