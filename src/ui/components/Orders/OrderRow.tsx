import React, { useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import {
  Box,
  Checkbox,
  TableCell,
  TableRow,
  Collapse,
  IconButton,
} from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import Typography, { DisableableTypography } from '../Utils/Typography'
// import { Location as LocationAPI, OrderStatusContractStatusEnum, OrderStatusOrderStatusEnum, PublicOrder } from '../../../apis-client'
// import { locationLabelFromLocation } from '../shared/utils'
import { ContractStatusEnum, EquipmentLeaseContract, Lease, OrderStatusEnum } from '../../../services/lease/types'
import { Company } from '../../../services/customer/types'
import { Facility } from '../../../services/places/types'
import { TableHeadCell } from '../../../store/ui/types'
import OverflowTooltip from '../shared/OverflowTooltip'
import { TableRowUiProps, NewlyCreatedNotif } from '../shared/GenericTable/Table'
import { getTimeLabel } from '../shared/utils'
import { StatusMap } from '../Containers/ContainerRow'
import { ColoredDot } from '../shared/ColoredDot'
import CollapsibleRow from '../shared/GenericTable/CollapsibleRow'

import OrderData from './OrderCollapsedData/OrderData'
import PatchOrder from './PatchOrder'
import DeleteOrder from './DeleteOrder'

const StyledTableRow = styled(TableRow)({
  height: 40,
  // '& > *': {
  //   borderBottom: 'unset',
  // },
  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: '#DEE7FA',
  },
})

export const useOrderStatusMap = (): StatusMap => {
  const theme = useTheme()

  return (new Map([
    [OrderStatusEnum.Created || 'CREATED', { color: theme.palette.warning.main, label: 'Created' }],
    [OrderStatusEnum.Accepted || 'ACCEPTED', { color: theme.palette.warning.main, label: 'Accepted' }],
    [OrderStatusEnum.AelerCanceled || 'AELER-CANCELED', { color: theme.palette.error.main, label: 'AELER Canceled' }],
    [OrderStatusEnum.CustomerCanceled || 'CUSTOMER-CANCELLED', { color: theme.palette.error.main, label: 'Customer Canceled' }],
    [OrderStatusEnum.CompletedFulfilled || 'COMPLETED-FULFILLED', { color: theme.palette.success.main, label: 'Fulfilled' }],
    [OrderStatusEnum.CompletedFailed || 'COMPLETED-FAILED', { color: theme.palette.error.main, label: 'Failed' }],
    ['READY', { color: theme.palette.success.main, label: 'Ready' }],
    ['ONGOING', { color: theme.palette.primary.main, label: 'Ongoing' }],
    ['OUTDATED', { color: theme.palette.error.main, label: 'Outdated' }],
    [undefined, { color: theme.palette.disabled?.main, label: 'Unavailable' }],
  ]))
}

const computeStatus = (unitsBooked: number, unitsAllocated: number, executionDate: Date, returnDate: Date, status?: OrderStatusEnum): string | undefined => {
  if (status === OrderStatusEnum.Accepted && unitsAllocated >= unitsBooked && executionDate.getTime() > new Date().getTime()) return 'READY'
  if (status === OrderStatusEnum.Accepted && unitsAllocated >= unitsBooked && executionDate.getTime() < new Date().getTime() && returnDate.getTime() > new Date().getTime()) return 'ONGOING'
  if (status === OrderStatusEnum.Accepted && returnDate.getTime() < new Date().getTime()) return 'OUTDATED'
  return status
}

export const mapToOrderRow = (order: Lease, customers: Company[], facilities: Facility[], useBackend?: boolean): OrderRowDataProps => {
  const activeLcs = order.equipmentleasecontracts.filter(lc => lc.active)

  const lcs = order.equipmentleasecontracts

  const computedStatus = computeStatus(
    order.units,
    activeLcs.length,
    order.executionDate, // FIXME: use statuses date
    order.returnDate, // FIXME: use statuses date
    order.equipmentleasestatuses.length > 0 ? order.equipmentleasestatuses[0].orderStatus : undefined,
  ) as any

  const originLoc = facilities.find(c => c.facilityId === order.pickupLocation)
  const originLabel = originLoc?.address?.city.name && originLoc?.name
    ? `${originLoc?.address?.city.name}, ${originLoc?.name}`
    : !originLoc?.address?.city.name && originLoc?.name
        ? originLoc?.name
        : order.pickupLocation

  return {
    id: order.orderId,
    createdAt: order.createdAt,
    executionDate: order.executionDate, // ? `${moment(order.executionDate).format('DD-MM-YYYY')}` : undefined,
    returnDate: order.returnDate, // ? `${moment(order.returnDate).format('DD-MM-YYYY')}` : undefined,
    origin: originLabel,
    destination: facilities.find(c => c.facilityId === order.dropoffLocation)?.name || order.dropoffLocation,
    units: order.units,
    contractStatus: order.equipmentleasestatuses.length > 0 ? order.equipmentleasestatuses[0].contractStatus : undefined,
    customer: customers.find(c => c.companyId === order.customerId)?.name || order.customerId,
    // allocatedContainers: order.equipmentleasecontracts.map(l => l.equipmentId),
    allocatedContainers: activeLcs.length,
    leaseContracts: lcs,
    isNewlyInserted: order.isNewlyInserted,
    customersBookingNumber: order.customersBookingNumber,
    originId: order.pickupLocation,
    destinationId: order.dropoffLocation,
    /* Computed fields, from backend */
    orderStatus: useBackend ? order.computedStatuses?.orderStatus : computedStatus,
  }
}

// const placeLabel = (location?: LocationAPI) => {
//   if (location) {
//     const geoL = locationLabelFromLocation(location)
//     let label = ''
//     if (location.depotId) {
//       label = `${location?.depotId}`
//       if (geoL) {
//         return label + `, ${geoL}`
//       }
//       return label
//     }
//     return geoL
//   }
//   return undefined
// }

// interface CellProps {
//   title: string;
//   selected?: boolean;
//   children: any;
// }

interface OrderCellProps {
  headCell: TableHeadCell;
  order: OrderRowDataProps & { expandedRow?: boolean };
  orderStatusMap: StatusMap;
  headerCells: TableHeadCell[];
}

const OrderCell = ({ headCell, order, orderStatusMap, headerCells }: OrderCellProps): (JSX.Element | null) => {
  if (headCell.hide) return null

  let content

  switch (headCell.id) {
    case 'id':
      return (<TableCell>
          <OverflowTooltip title={order.id} deps={[headerCells]} >
            <Typography noWrap variant='body2' >{order.id}</Typography>
          </OverflowTooltip>
        </TableCell>)
    case 'createdAt':
      content = order.createdAt && getTimeLabel(order.createdAt, 'dateHourWithTz')
      break
    case 'orderStatus':
      return (<TableCell>
          <Box display='flex' alignItems='center'>
            <ColoredDot color={orderStatusMap.get(order.orderStatus)?.color} />
            <OverflowTooltip title={orderStatusMap.get(order.orderStatus)?.label || ''} deps={[headerCells]} >
              <DisableableTypography noWrap variant='body2'>
                {orderStatusMap.get(order.orderStatus)?.label}
              </DisableableTypography>
            </OverflowTooltip>
          </Box>
        </TableCell>)
    case 'executionDate':
      content = order.executionDate && getTimeLabel(order.executionDate)
      break
    case 'returnDate':
      content = order.returnDate && getTimeLabel(order.returnDate)
      break
    case 'actions': {
      return (
        <TableCell padding={'none'} align='center'>
          <Box display='flex' alignItems={'center'} justifyContent={'space-between'} >
          <DeleteOrder orderId={order.id} disabled={order.allocatedContainers > 0}/>
            <PatchOrder patchOrder={{
              orderId: order.id,
              returnDate: order.returnDate,
              executionDate: order.executionDate,
              units: order.units,
              customersBookingNumber: order.customersBookingNumber,
              pickupLocation: order.originId,
              dropoffLocation: order.destinationId,
              status: order.orderStatus,
            }}/>
            <IconButton size='small' color='primary'>
              { order.expandedRow ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </TableCell>
      )
    }

    default:
      content = order[headCell.id as 'id']
      break
  }
  return (<TableCell>
        <OverflowTooltip title={content || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body2' >{content}</DisableableTypography>
        </OverflowTooltip>
      </TableCell>)
}

export interface OrderRowDataProps extends TableRowUiProps {
  id: string;
  createdAt?: Date,
  executionDate?: Date;
  returnDate?: Date;
  origin?: string;
  destination?: string;
  orderStatus?: OrderStatusEnum;
  contractStatus?: ContractStatusEnum;
  customer?: string;
  allocatedContainers: number;
  units?: number;
  leaseContracts?: EquipmentLeaseContract[];
  customersBookingNumber?: string;
  originId?: string;
  destinationId?: string;
}
export interface OrderRowProps extends OrderRowDataProps {
  headerCells: TableHeadCell[];
  isSelected?: boolean;
  disableSelect?: boolean;

  handleRowClick: (event: React.MouseEvent<unknown>, id: string) => void;
}

const OrderRow = (props: OrderRowProps): JSX.Element => {
  const {
    id,
    createdAt,
    executionDate,
    returnDate,
    origin,
    destination,
    units,
    customersBookingNumber,
    allocatedContainers,
    leaseContracts,
    orderStatus,
    contractStatus,
    customer,
    originId,
    destinationId,
    isNewlyInserted,
    isSelected,
    disableSelect,
    headerCells,
    handleRowClick,
  } = props

  const [open, setOpen] = useState(false)
  const orderStatusMap = useOrderStatusMap()

  const labelId = `enhanced-table-checkbox-${id}`

  const cellProps = {
    id,
    createdAt,
    orderStatus,
    customer,
    contractStatus,
    origin,
    executionDate,
    returnDate,
    destination,
    units,
    allocatedContainers,
    customersBookingNumber,
    expandedRow: open,
    originId,
    destinationId,
  }

  const handleDropdown = (open: boolean) => {
    setOpen(open)
  }

  return (
    <React.Fragment>
      <StyledTableRow
        hover
        // onClick={(event) => handleRowClick(event, id)}
        onClick={() => handleDropdown(!open)}
        role={disableSelect ? 'checkbox' : undefined}
        aria-checked={isSelected}
        tabIndex={-1}
        selected={isSelected}
        sx={{ ...(!disableSelect && { cursor: 'pointer' }) }}
      >
        {
          !disableSelect &&
            <TableCell padding="checkbox" sx={{ position: 'relative' }}>
            { isNewlyInserted && <NewlyCreatedNotif />}
              <Checkbox
                color='primary'
                checked={isSelected}
                inputProps={{ 'aria-labelledby': labelId }}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  handleRowClick(event, id)
                }}
              />
            </TableCell>
        }
        { headerCells.filter(h => h.label).map(hc =>
          <OrderCell
            key={hc.id}
            headCell={hc}
            headerCells={headerCells}
            order={cellProps}
            orderStatusMap={orderStatusMap}
          />).filter(Boolean)}
      </StyledTableRow>
      <CollapsibleRow open={open} colSpan={headerCells.filter(h => !h.hide).length + 1}>
        <OrderData orderId={id || ''} leaseContracts={leaseContracts} />
      </CollapsibleRow>
    </React.Fragment>
  )
}

export default OrderRow
