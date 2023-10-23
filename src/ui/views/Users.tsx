import React, { useState, useEffect, useMemo } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { DataGridPro, GridColDef, useGridApiRef } from '@mui/x-data-grid-pro'

import { AppState } from '../../store'
import { SortByUI, TableHeadCell } from '../../store/ui/types'
import { listCompanies as listCustomers } from '../../services/customer/actions'
import GenericTable from '../components/shared/GenericTable/Table'
import { genericHandleSelectAllClick, genericHandleRowClick } from '../components/shared/GenericTable/utils'
import { FilterChip, StateFilter } from '../components/shared/Filter/FilterButton'
import CollapsibleChips from '../components/shared/Filter/CollapsibleChips'
import Searchbar from '../components/shared/Search'
import CustomerRow, { CustomerRowDataProps, CustomerRowProps, mapToCustomerRow } from '../components/Customers/CustomerRow'
// import NewCustomer from '../components/Locations/NewCustomer'
import { getLeaseRates } from '../../services/financials/actions'
import { filterCustomers } from '../components/Customers/Filter/utils'
import { setCustomerFilters, setCustomerSortBy, setDatagridState } from '../../store/ui/actions'
import { ENABLE_DATAGRID } from '../globals'
import NewLeaseRate from '../components/Customers/NewLeaseRate'
import { CustomOverflowValue } from '../components/shared/CustomOverflowValue'
import { setDefaultsDataGridState } from '../components/shared/utils'

export const inititalCustomerHeadCells: TableHeadCell[] = [
  { id: 'id', isSortable: true, label: 'Customer', hide: false },
  { id: 'leaseRate', isSortable: true, label: 'Daily lease cost', hide: false },
  { id: 'actions', isSortable: false, align: 'center', label: null },
]

export const CustomersView: React.FunctionComponent<void> = () => {
  const [selected, setSelected] = useState<string[]>([])
  const [rowData, setCustomers] = useState<CustomerRowDataProps[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<{ customers: CustomerRowDataProps[], numOfFilters: number}>({ customers: [], numOfFilters: 0 })
  const [searchFilter, setSearchFilter] = useState('')
  const [chips, setChips] = useState<FilterChip[] | null>(null)
  const setFilters = (filters: StateFilter[]) => _dispatch(setCustomerFilters(filters))
  const { customerSortBy } = useSelector((state: AppState) => state.ui)

  const handleClearSearch = () => {
    setSearchFilter('')
  }

  const { companies: customers, loadingStatus } = useSelector((state: AppState) => state.company)
  const { lease } = useSelector((state: AppState) => state.financials)

  // const { customerTableHeadCells, orderSortBy, orderFilters } = useSelector((state: AppState) => state.ui)
  const customerTableHeadCells = inititalCustomerHeadCells

  const _dispatch = useDispatch()

  const apiRef = useGridApiRef()
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)

  useEffect(() => {
    if (ENABLE_DATAGRID && datagridState?.customers) {
      apiRef.current.restoreState(setDefaultsDataGridState(datagridState.customers))
    }
  }, [])

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, customers: columnState }))
  }

  const columns = useMemo(() => [
    {
      field: 'actions',
      headerName: '',
      flex: 0.1,
      sortable: false,
      filterable: false,
      hideable: false,
      minWidth: 70,
      renderCell: (params: {row: CustomerRowProps}) => (
        <Box display='flex' alignItems={'center'} justifyContent={'space-between'} >
          <NewLeaseRate customerId={params.row.id} />
        </Box>
      ),
    },
    {
      field: 'id',
      headerName: 'Customer',
      flex: 1,
      renderCell: (params: {row: CustomerRowProps}) => (
        <CustomOverflowValue dataKey={'customers'} value={params.row.id} />
      ),
    },
    {
      field: 'leaseRate',
      headerName: 'Daily lease cost',
      flex: 1,
      renderCell: (params: {row: CustomerRowProps}) => (
        <CustomOverflowValue dataKey={'customers'} value={params.row.leaseRate} />
      ),
    },
  ] as GridColDef[],
  [])

  useEffect(() => {
    _dispatch(listCustomers({}))
    _dispatch(getLeaseRates({}))
  }, [])

  // useEffect(() => {
  //   customers.forEach(d => _dispatch(listCustomersStats(d.customerId)))
  // }, [customers])

  useEffect(() => {
    if (customers.length) {
      setCustomers(filterCustomers(customers.map(l => mapToCustomerRow(l)), searchFilter))
      // setCustomers(customers.map(l => mapToCustomerRow(l, lease.find(d => d.customerId === l.companyId))))
    }
  }, [customers, lease, searchFilter])

  // const rowData = filterCustomers(customers.map(l => mapToCustomerRow(l, companies, customers)), searchFilter)

  const handleSelectAllClick = genericHandleSelectAllClick(filteredCustomers.customers, setSelected)
  const handleRowClick = genericHandleRowClick(selected, setSelected)

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  // const handleFiltersChange = (customers: CustomerRowDataProps[], chips: FilterChip[] | null) => {
  //   const numOfFilters = (searchFilter !== '' ? 1 : 0) + (chips ? chips.length : 0)
  //   setFilteredCustomers({ customers: filterCustomers(customers, searchFilter), numOfFilters })
  //   setSelected([])
  //   setChips(chips)
  // }

  // const handleCreateCustomer = (customer: any) => {
  //   // _dispatch(addLocation(location))
  //   // _dispatch(addCustomerWithAddress(customer))
  //   // FIXME
  // }

  return (
    <Box width='100%' id='customers-list' display='flex' flexDirection='column' >
      <Box mt={2} mb={1} display='flex' alignItems='center' flexWrap='wrap'>
        <Box flexGrow={1} display='flex' alignItems='center' flexWrap='wrap'>
          <Searchbar placeholder={'Search customers...'} filter={searchFilter} setFilter={setSearchFilter} clearAll={handleClearSearch} />
          {/* <EndCustomer ml={2} customers={customers.filter(o => selected.includes(o.orderId))} onEndCustomer={handleEndCustomers}/> */}
          { (loadingStatus) && <CircularProgress sx={{ marginLeft: '16px' }} size={20}/> }
        </Box>
        {/* <NewCustomer onCreate={handleCreateCustomer} /> */}

        {/* <FilterButton
          icon
          disabled={false}
          data={rowData}
          dataFilter={orderFilter}
          options={orderOptions}
          getOptions={getCustomerOptions}
          onFilter={handleFiltersChange}
          filters={orderFilters}
          setFilters={setFilters}
        />
        <FilterColumns type='order' /> */}
      </Box>
      <Box mb={1}>
        <CollapsibleChips open={Boolean(chips?.length)} chips={chips} />
      </Box>
      <Box display='flex' flexDirection='column' overflow='hidden' height={'100%'}>
        { ENABLE_DATAGRID
          ? <DataGridPro
          apiRef={ apiRef }
          // till MUI v6, column visibility model must be initialized for onColumnVisibilityModelChange to work
          initialState={{ columns: { columnVisibilityModel: {} } }}
          columns={ columns }
          rows={ rowData }
          getRowId={ row => row.id }
          // rowsPerPageOptions={[25, 50, 100, 200]}
          // pageSize={ pageSize }
          // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          // pagination
        />
          : <GenericTable
            headerCells={customerTableHeadCells}
            order={customerSortBy.order}
            orderBy={customerSortBy.orderBy}
            setSortBy={(sortBy: SortByUI) => _dispatch(setCustomerSortBy(sortBy))}
            rows={rowData}
            selected={selected}
            handleSelectAllClick={handleSelectAllClick}
            rowComponent={({ ...customer }: CustomerRowProps) => (
              <CustomerRow
                {...customer}
                key={customer.id}
                // handleRowClick={handleRowClick}
                isSelected={isSelected(customer.id)}
              />
            )}
          />
            }
      </Box>
    </Box >
  )
}

export default CustomersView
