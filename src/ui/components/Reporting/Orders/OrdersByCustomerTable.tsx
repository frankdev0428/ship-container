import * as React from 'react'
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro'
import { Paper, styled } from '@mui/material'
import { useSelector } from 'react-redux'

import { AppState } from '../../../../store'

const StyledDataGrid = styled(DataGridPro)({
  '& .MuiDataGrid-columnSeparator': {
    visibility: 'hidden',
    opacity: 0,
  },
  '& .MuiDataGrid-columnSeparator--sideRight': {
    visibility: 'hidden',
    opacity: 0,
  },
})
const columns: GridColDef[] = [
  {
    field: 'customerId',
    headerName: 'Customer',
  },
  {
    field: 'ordersTotal',
    headerName: 'Orders',
  },
  {
    field: 'twentyFt',
    headerName: '20FT',
  },
]
interface OrderByCustomersTableProps {
  data: {
    customerId: string;
    ordersTotal: string;
    twentyFt?: string;
  }[]
}

const OrderByCustomersTable = ({ data }: OrderByCustomersTableProps): JSX.Element => {
  const { companies: customers, loadingStatus } = useSelector((state: AppState) => state.company)

  const customerDataMapped = data.map((d, i) => ({
    id: i,
    customerId: d.customerId && d.customerId !== '' ? (customers.find(c => c.companyId === d.customerId)?.name || d.customerId) : 'N/A',
    ordersTotal: d.ordersTotal && d.ordersTotal !== '' ? d.ordersTotal : 'N/A',
    twentyFt: d.twentyFt && d.twentyFt !== '' ? d.twentyFt : 'N/A',
  }))

  return (
    <Paper elevation={4} sx={{ height: '100%', width: '100%' }}>
      <StyledDataGrid
        rows={customerDataMapped}
        columns={columns}
        hideFooter={true}
      />
    </Paper>
  )
}
export default OrderByCustomersTable
