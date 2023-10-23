import React from 'react'
import { Box } from '@mui/material'
import { useSelector } from 'react-redux'

import { AppState } from '../../../store'
import Typography from '../Utils/Typography'
import { TableHeadCell } from '../../../store/ui/types'
import GenericTable from '../shared/GenericTable/Table'
import { Loading } from '../shared/component_utils'

// import NewCustomer from './NewCustomer'
import CustomerRow, { mapToCustomerRow, CustomerRowProps } from './CustomerRow'

const NoData = () => {
  return (
    <Box margin={'4px auto'} width='80%'>
      <Typography align='center' variant='subtitle2'>{'There are no customerments yet.'}</Typography>
    </Box>
  )
}

const customerTableHeadCells: TableHeadCell[] = [
  { id: 'id', isSortable: true, label: 'Customer', hide: false },
  { id: 'leaseRate', isSortable: true, label: 'Daily lease cost', hide: false },
  { id: 'actions', isSortable: false, align: 'center', label: null },
]

interface CustomersTableProps {
  handleCreateCustomer: (customer: any) => void;
}

const CustomersTable = ({ handleCreateCustomer }: CustomersTableProps) => {
  const { companies: customers, loadingStatus } = useSelector((state: AppState) => state.company)
  const { lease } = useSelector((state: AppState) => state.financials)

  const filteredCustomers = customers.map(m => mapToCustomerRow(m, lease.find(d => d.customerId === m.companyId)))

  return (
    <Box id='customers-table-wrapper' display='flex' flexDirection={'column'} maxHeight='50vh' pt={1} pb={1}>
      <Box display='flex' alignItems={'center'} justifyContent={'space-between'} mb={1}>
        <Typography >Customerments</Typography>
        {/* <NewCustomer onCreate={handleCreateCustomer}/> */}
      </Box>
      <Loading loading={loadingStatus}>
        <Box display='flex' flexDirection='column' overflow='hidden' height={'100%'}>
          <GenericTable
            headerCells={customerTableHeadCells}
            order={'asc'}
            orderBy={'id'}
            rows={filteredCustomers}
            handleSelectAllClick={() => {}}
            disableSelect
            rowComponent={({ ...customer }: CustomerRowProps) => (
              <CustomerRow
                {...customer}
                key={customer.id}
              />
            )}
            noDataComponent={<NoData/>}
          />
        </Box>
      </Loading>
    </Box>
  )
}

export default CustomersTable
