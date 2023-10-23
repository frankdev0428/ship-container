import React from 'react'
import {
  Box,
  Checkbox,
  TableCell,
  TableRow,
  IconButton,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

import Typography, { DisableableTypography } from '../Utils/Typography'
import { ContractStatusEnum, CurrentLease, Lease, OrderStatusEnum } from '../../../services/lease/types'
import { Company } from '../../../services/customer/types'
import { Facility, ExchangeLocation } from '../../../services/places/types'
import { Move } from '../../../services/move/types'
import { MoveCost } from '../../../services/financials/types'
import { TableHeadCell } from '../../../store/ui/types'
import OverflowTooltip from '../shared/OverflowTooltip'
import { mapCurrencySymbols } from '../shared/currencySymbols'
import { getTimeLabel } from '../shared/utils'

import NewMoveCost from './NewMoveCost'

export const mapToMoveRow = (move: Move, customers: Company[], facilities: Facility[], locations: ExchangeLocation[], leases: CurrentLease[], costs: MoveCost[]): MoveRowDataProps =>
  ({
    id: move.moveId,
    customer: customers.find(c => c.companyId === move.customerId)?.name || move.customerId,
    moveType: move.moveType,
    pickupDate: move.pickupDate,
    dropoffDate: move.dropoffDate,
    origin: locations.find(c => c.exchangeLocationId === move.originId)?.name || move.originId,
    destination: locations.find(c => c.exchangeLocationId === move.destinationId)?.name || move.destinationId,
    orderId: leases.find(l => l.contractId === move.equipmentLeaseContractId)?.orderId || move.equipmentLeaseContractId,
    costs: costs.filter(c => c.moveId === move.moveId),
  })

interface MoveCellProps {
  headCell: TableHeadCell;
  move: MoveRowDataProps;
  // orderStatusMap: Map<string | undefined, { color: string; label: string; }>;
  headerCells: TableHeadCell[];
}

const MoveCell = ({ headCell, move, /* orderStatusMap,  */headerCells }: MoveCellProps): (JSX.Element | null) => {
  if (headCell.hide) return null

  let content

  switch (headCell.id) {
    case 'id':
      return (<TableCell>
          <OverflowTooltip title={move.id} deps={[headerCells]} >
            <Typography noWrap variant='body1' >{move.id}</Typography>
          </OverflowTooltip>
        </TableCell>)
      // case 'orderStatus':
      //   return (<TableCell>
      //       <Box display='flex' alignItems='center'>
      //         <ColoredDot color={orderStatusMap.get(order.orderStatus)?.color} />
      //         <OverflowTooltip title={orderStatusMap.get(order.orderStatus)?.label || ''} deps={[headerCells]} >
      //           <DisableableTypography noWrap variant='body1'>
      //             {orderStatusMap.get(order.orderStatus)?.label}
      //           </DisableableTypography>
      //         </OverflowTooltip>
      //       </Box>
      //     </TableCell>)
      // case 'executionDate':
      //   content = moment(move.executionDate).format('DD-MM-YYYY')
      //   break

    case 'pickupDate':
      content = move.pickupDate ? getTimeLabel(move.pickupDate) : undefined
      return (<TableCell>
        <OverflowTooltip title={content || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1' >{content}</DisableableTypography>
        </OverflowTooltip>
      </TableCell>)
    case 'dropoffDate':
      content = move.dropoffDate ? getTimeLabel(move.dropoffDate) : undefined
      return (<TableCell>
        <OverflowTooltip title={content || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1' >{content}</DisableableTypography>
        </OverflowTooltip>
      </TableCell>)
    case 'costs':
      return (<TableCell>
        {move.costs?.map((c, idx) => (<div style={{
          backgroundColor: 'lightgray',
          borderRadius: '10%',
          maxWidth: 60,
        }} key={idx} >{c.cost}{mapCurrencySymbols.get(c.currency) || c.currency}</div>))}
      </TableCell>)
    case 'actions':
      return (<TableCell padding={'none'} align='center'>
          <Box display='flex'>
            <IconButton size='small' color='primary' disabled={true /** FIXME */}>
              <EditIcon />
            </IconButton>
            <NewMoveCost moveId={move.id}/>
          </Box>
        </TableCell>
      )
    default:
      content = move[headCell.id as 'id']
      return (<TableCell>
        <OverflowTooltip title={content || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1' >{content}</DisableableTypography>
        </OverflowTooltip>
      </TableCell>)
      break
  }
}

export interface MoveRowDataProps {
  id: string;
  customer?: string;
  moveType?: Move['moveType'];
  pickupDate?: Date;
  dropoffDate?: Date;
  origin?: string;
  destination?: string;
  orderId?: string;
  costs?: MoveCost[];
}
export interface MoveRowProps extends MoveRowDataProps {
  headerCells: TableHeadCell[];
  isSelected?: boolean;
  disableSelect?: boolean;

  // handleRowClick: (event: React.MouseEvent<unknown>, id: string) => void;
}

const MoveRow = (props: MoveRowProps): JSX.Element => {
  const {
    id,
    customer,
    moveType,
    pickupDate,
    dropoffDate,
    origin,
    destination,
    orderId,
    costs,

    isSelected,
    disableSelect,
    headerCells,

    // handleRowClick,
  } = props
  // const orderStatusMap = useOrderStatusMap()

  const labelId = `enhanced-table-checkbox-${id}`

  const cellProps = {
    id,
    customer,
    moveType,
    pickupDate,
    dropoffDate,
    origin,
    destination,
    orderId,
    costs,
  }

  return (
    <TableRow
      // hover
      // onClick={(event) => handleRowClick(event, id)}
      role={disableSelect ? 'checkbox' : undefined}
      aria-checked={isSelected}
      tabIndex={-1}
      selected={isSelected}
      {...!disableSelect && { style: { cursor: 'pointer' } }}
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
      { headerCells.map(hc =>
        <MoveCell
          key={hc.id}
          headCell={hc}
          headerCells={headerCells}
          move={cellProps}
          // orderStatusMap={orderStatusMap}
        />).filter(Boolean)}
    </TableRow>
  )
}

export default MoveRow
