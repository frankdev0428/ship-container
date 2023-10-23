import React from 'react'
import {
  Box,
  Checkbox,
  TableCell,
  TableRow,
  IconButton,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

import Typography, { DisableableTypography } from '../Utils/Typography'
// import { Location as LocationAPI, OrderStatusContractStatusEnum, OrderStatusOrderStatusEnum, PublicOrder } from '../../../apis-client'
// import { locationLabelFromLocation } from '../shared/utils'
import { Company as Customer } from '../../../services/customer/types'
import { TableHeadCell } from '../../../store/ui/types'
import OverflowTooltip from '../shared/OverflowTooltip'
import { LeaseRate } from '../../../services/financials/types'
import { mapCurrencySymbols } from '../shared/currencySymbols'

import NewLeaseRate from './NewLeaseRate'

export const mapToCustomerRow = (customer: Customer, lease?: LeaseRate): CustomerRowDataProps => {
  return {
    id: customer.name,
    customerId: customer.companyId,
    leaseRate: lease ? `${lease?.dailyRate}${mapCurrencySymbols.get(lease?.currency) || lease?.currency}` : undefined,
  }
}
interface CustomerCellProps {
  headCell: TableHeadCell;
  customer: CustomerRowDataProps;
  // orderStatusMap: Map<string | undefined, { color: string; label: string; }>;
  headerCells: TableHeadCell[];
}

const CustomerCell = ({ headCell, customer, /* orderStatusMap,  */headerCells }: CustomerCellProps): (JSX.Element | null) => {
  if (headCell.hide) return null

  let content

  switch (headCell.id) {
    case 'id':
      return (<TableCell>
          <OverflowTooltip title={customer.id} deps={[headerCells]} >
            <Typography noWrap variant='body1' >{customer.id}</Typography>
          </OverflowTooltip>
        </TableCell>)
    // case 'containers':
    //   return (<TableCell>
    //       <OverflowTooltip title={customer.containers} deps={[headerCells]} >
    //         <Typography noWrap variant='body1' >{customer.containers}</Typography>
    //       </OverflowTooltip>
    //     </TableCell>)        
    default:
      content = customer[headCell.id as 'id']
      return (<TableCell>
        <OverflowTooltip title={content || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1' >{content}</DisableableTypography>
        </OverflowTooltip>
      </TableCell>)
  }
}

export interface CustomerRowDataProps {
  id: string;
  customerId: string;
  leaseRate?: string;
  // customer?: string;
  // customerType?: Customer['customerType'];
  // pickupDate?: Date;
  // dropoffDate?: Date;
  // origin?: string;
  // destination?: string;
  // orderId?: string;
  // costs: CustomerCost[];
}
export interface CustomerRowProps extends CustomerRowDataProps {
  headerCells: TableHeadCell[];
  isSelected?: boolean;
  disableSelect?: boolean;

  // handleRowClick: (event: React.MouseEvent<unknown>, id: string) => void;
}

const CustomerRow = (props: CustomerRowProps): JSX.Element => {
  const {
    id,
    customerId,
    leaseRate,
    // customer,
    // customerType,
    // pickupDate,
    // dropoffDate,
    // origin,
    // destination,
    // orderId,
    // costs,

    isSelected,
    disableSelect,
    headerCells,

    // handleRowClick,
  } = props
  // const orderStatusMap = useOrderStatusMap()

  const labelId = `enhanced-table-checkbox-${id}`

  const cellProps = {
    id,
    customerId,
    leaseRate,
    // customer,
    // customerType,
    // pickupDate,
    // dropoffDate,
    // origin,
    // destination,
    // orderId,
    // costs,
  }

  return (
    <TableRow
      // hover
      // onClick={(event) => handleRowClick(event, customerId)}
      role={disableSelect ? 'checkbox' : undefined}
      aria-checked={isSelected}
      tabIndex={-1}
      selected={isSelected}
    >
      {
        !disableSelect &&
          <TableCell padding="checkbox">
            <Checkbox
              color='primary'
              checked={isSelected}
              inputProps={{ 'aria-labelledby': labelId }}
            />
          </TableCell>
      }
      { headerCells.filter(h => h.id !== 'actions').map(hc =>
        <CustomerCell
          key={hc.id}
          headCell={hc}
          headerCells={headerCells}
          customer={cellProps}
          // orderStatusMap={orderStatusMap}
        />).filter(Boolean)}
        <TableCell padding={'none'} align='center'>
          <NewLeaseRate customerId={customerId}/>
        </TableCell>
    </TableRow>
  )
}

export default CustomerRow
