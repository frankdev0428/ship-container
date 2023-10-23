import React from 'react'
import {
  Box,
  Checkbox,
  TableCell,
  TableRow,
  IconButton,
  Button,
  Link,
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import UndoIcon from '@mui/icons-material/Undo'
import EditIcon from '@mui/icons-material/Edit'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Typography, { DisableableTypography } from '../../Utils/Typography'
// import { Location as LocationAPI, OrderStatusContractStatusEnum, OrderStatusOrderStatusEnum, PublicOrder } from '../../../apis-client'
// import { locationLabelFromLocation } from '../shared/utils'
import { ContractStatusEnum, CurrentLease, Lease, OrderStatusEnum } from '../../../../services/lease/types'
import { Company } from '../../../../services/customer/types'
import { Facility } from '../../../../services/places/types'
import { TableHeadCell } from '../../../../store/ui/types'
import OverflowTooltip from '../../shared/OverflowTooltip'
import { ContractWithLease } from '../../../../services/equipment/types'
import { toggleLease } from '../../../../services/thunks'
import { getTimeLabel } from '../../shared/utils'

export const getContractExecutionDate = (allocation: ContractWithLease) => (
  allocation.equipmentstatus?.startAtActual || allocation.equipmentstatus?.startAtPlanned || allocation.equipmentlease?.executionDate
)

export const getContractReturnDate = (allocation: ContractWithLease) => (
  allocation.equipmentstatus?.stopAtActual || allocation.equipmentstatus?.stopAtPlanned || allocation.equipmentlease?.returnDate
)

export const getContractStartLocationId = (allocation: ContractWithLease) => (
  allocation.equipmentstatus?.locationStartActual || allocation.equipmentstatus?.locationStartPlanned || allocation.equipmentlease?.pickupLocation
)

export const getContractStopLocationId = (allocation: ContractWithLease) => (
  allocation.equipmentstatus?.locationStopActual || allocation.equipmentstatus?.locationStopPlanned || allocation.equipmentlease?.dropoffLocation
)

export const mapToAllocationRow = (allocation: ContractWithLease, customers: Company[], depots: Facility[], leases: CurrentLease[]): AllocationRowDataProps => {
  const originId = getContractStartLocationId(allocation)
  const destinationId = getContractStopLocationId(allocation)

  return ({
    id: allocation.orderId,
    customer: customers.find(c => c.companyId === allocation.equipmentlease?.customerId)?.name || allocation.equipmentlease?.customerId,
    origin: depots.find(c => c.facilityId === originId)?.name || originId,
    executionDate: getContractExecutionDate(allocation),
    destination: depots.find(c => c.facilityId === destinationId)?.name || allocation.equipmentlease?.dropoffLocation,
    returnDate: getContractReturnDate(allocation),
    units: allocation.equipmentlease?.units,
    // allocatedContainers: order.equipmentleasecontracts.length,
    active: allocation.active,
    contractId: allocation.equipmentLeaseContractId,
    comment: allocation?.equipmentstatus?.comment,
  })
}

interface AllocationCellProps {
  headCell: TableHeadCell;
  allocation: AllocationRowDataProps;
  // orderStatusMap: Map<string | undefined, { color: string; label: string; }>;
  headerCells: TableHeadCell[];
  handleToggle: (contractId: string) => void;
  onEdit: (id: string) => void;
  linkTo?: boolean;
}

const AllocationCell = ({ headCell, allocation, /* orderStatusMap,  */headerCells, handleToggle, onEdit, linkTo }: AllocationCellProps): (JSX.Element | null) => {
  if (headCell.hide) return null
  const history = useHistory()

  let content
  const isDisabledActions = true

  // FIXME: href relative routing...
  switch (headCell.id) {
    case 'id':
      return (<TableCell>
          <OverflowTooltip title={allocation.id} deps={[headerCells]} >
            <Typography noWrap variant='body1' >
              {linkTo
                ? <Link href={`/ecosystem/fleet-management/orders?orderId=${allocation.id}`}>
                {allocation.id}
              </Link>
                : allocation.id}
            </Typography>
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
      //   content = moment(allocation.executionDate).format('DD-MM-YYYY')
      //   break

    case 'returnDate':
      content = allocation.returnDate ? getTimeLabel(allocation.returnDate) : undefined
      break
    case 'executionDate':
      content = allocation.executionDate ? getTimeLabel(allocation.executionDate) : undefined
      break
    case 'units':
      content = allocation.units !== undefined ? `${allocation.units}` : undefined
      break
    case 'comment':
      return (<TableCell>
           <OverflowTooltip title={allocation.comment || ''} deps={[headerCells.map(hc => hc.id), allocation.comment]}>
              <DisableableTypography noWrap variant='body1'>{allocation.comment}</DisableableTypography>
            </OverflowTooltip>
          </TableCell>)
    case 'actions':
      content = allocation.units !== undefined ? `${allocation.units}` : undefined
      return (
        <TableCell padding={'none'} align='center'>
          <IconButton size='small' color='primary' onClick={(event) => {
            event.stopPropagation()
            event?.preventDefault()
            onEdit(allocation.contractId)
          }}>
            <EditIcon/>
          </IconButton>
            { allocation.active !== undefined && <IconButton disabled={isDisabledActions} size='small' onClick={() => handleToggle(allocation.contractId)}>
            { allocation.active ? <CancelIcon color={isDisabledActions ? 'disabled' : 'error'} /> : <SettingsBackupRestoreIcon color={isDisabledActions ? 'disabled' : 'primary'} /> }
          </IconButton> }
        </TableCell>
      )
      break
    default:
      content = allocation[headCell.id as 'id']
      break
  }

  return (<TableCell>
        <OverflowTooltip title={content || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1' >{content}</DisableableTypography>
        </OverflowTooltip>
      </TableCell>)
}

export interface AllocationRowDataProps {
  id: string;
  customer?: string;
  origin?:string;
  executionDate?: Date;
  destination?: string;
  returnDate?: Date;
  units?: number;
  active?: boolean;
  contractId: string;
  comment?: string;
}
export interface AllocationRowProps extends AllocationRowDataProps {
  headerCells: TableHeadCell[];
  isSelected?: boolean;
  disableSelect?: boolean;
  linkTo?: boolean;

  onEdit: (id: string) => void;
  // handleRowClick: (event: React.MouseEvent<unknown>, id: string) => void;
}

const AllocationRow = ({
  id,
  customer,
  origin,
  executionDate,
  destination,
  returnDate,
  units,
  active,
  contractId,

  isSelected,
  disableSelect,
  headerCells,
  linkTo,
  comment,
  onEdit,

  // handleRowClick,
} : AllocationRowProps): JSX.Element => {
  const _dispatch = useDispatch()

  const labelId = `enhanced-table-checkbox-${id}`

  const handleToggle = (contractId: string) => {
    _dispatch(toggleLease(contractId))
  }

  const cellProps = {
    id,
    customer,
    origin,
    executionDate,
    destination,
    returnDate,
    units,
    active,
    contractId,
    comment,

    // handleToggle,
    // onEdit,
  }

  return (
    <TableRow
      // hover
      // onClick={(event) => handleRowClick(event, moveId)}
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
        <AllocationCell
          key={hc.id}
          headCell={hc}
          headerCells={headerCells}
          allocation={cellProps}
          handleToggle={handleToggle}
          onEdit={onEdit}
          // orderStatusMap={orderStatusMap}
          linkTo={true}
        />).filter(Boolean)}
    </TableRow>
  )
}

export default AllocationRow
