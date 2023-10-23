import React, { Fragment, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import {
  Box,
  Checkbox,
  IconButton,
  Link,
  TableCell,
  tableCellClasses,
  TableRow,
} from '@mui/material'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import CancelIcon from '@mui/icons-material/Cancel'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'
import { useDispatch } from 'react-redux'

import { TableHeadCell } from '../../../store/ui/types'
import { Alert } from '../../../services/alerts/types'
import { Equipment, ContainerStatusEnum } from '../../../services/equipment/types'
import { Company } from '../../../services/customer/types'
import { Facility } from '../../../services/places/types'
import { StorageRate, LeaseRate } from '../../../services/financials/types'
import { CurrentLease, EquipmentLeaseContract } from '../../../services/lease/types'
import { EquipmentMoveInput } from '../../../services/move/types'
import Typography, { DisableableTypography } from '../Utils/Typography'
import OverflowTooltip from '../shared/OverflowTooltip'
import { toggleLease } from '../../../services/thunks'
import UpdateStatus from '../Containers/Status/UpdateStatus'
import { CurrentStatus } from '../../../apis-client'
import { getTimeLabel } from '../shared/utils'
import { StatusMap } from '../Containers/ContainerRow'
import { ColoredDot } from '../shared/ColoredDot'
import { computeEquipmentStatus } from '../computeEquipmentStatus'

import NewVisContract from './VisContract/NewVisContract'

export const containerDateFormat = 'DD-MM-YYYY'

const StyledTableRow = styled(TableRow)({
  height: 40,
  // '& > *': {
  //   borderBottom: 'unset',
  // },
})

export const mapToContainerRow = (container: Equipment, companies: Company[], depots: Facility[], storage?: StorageRate[], lease?: LeaseRate[], lc?: EquipmentLeaseContract, useBackend?: boolean): ContainerRowDataProps => {
  const {
    status,
    loc1,
    allocationStatus,
    operationalStatus,
    customer,
    availableFrom,
    availableTo,
    currentLocation,
    destinationLocation,
    idleDays,
    idleCost,
    idleCostForecast,
    leaseRevenue,
    leaseRevenueForecast,
    orderId,
  } = computeEquipmentStatus(container, companies, depots, storage, lease)

  const currentAllocationStatus = [container.currentStatus, ...(container.futureStatuses ? container.futureStatuses : [])].find(s => (s as any)?.equipmentLeaseContractId === lc?.equipmentLeaseContractId)
  const thisAllocation = lc && container.blockingStatuses?.find(s => (s as any)?.equipmentLeaseContractId === lc?.equipmentLeaseContractId)
  const currentOrNextAllocation = [container.currentStatus, ...(container.futureStatuses ? container.futureStatuses : [])].find(s => (s as any)?.equipmentLeaseContractId !== undefined)

  const returnLocationId = thisAllocation?.locationStopActual || thisAllocation?.locationStopPlanned || loc1
  const returnLocation = depots.find(c => c.facilityId === returnLocationId)?.name || returnLocationId

  return {
    id: container.aelerContainerId || container.equipmentId,
    containerId: container.aelerContainerId,
    alerts: [],
    equipmentId: container.equipmentId,
    leases: [
      ...(container.currentLease ? [container.currentLease] : []),
      ...(container.futureLeases ? container.futureLeases : []),
    ],
    leaseContractId: lc?.equipmentLeaseContractId,
    blockingStatuses: container.blockingStatuses,
    containerVersion: container.container?.containerVersion,
    containerCertificateDate: container.container?.cscCertDate,
    containerDoorType: container.container?.doorType,
    containerFloorType: container.container?.floorType,
    /* computed state, that can be fetched from BE */
    orderId: useBackend ? container.computedFields?.orderId : orderId,
    currentLocation: useBackend ? (depots.find(c => c.facilityId === container.computedFields?.currentLocation)?.name || container.computedFields?.currentLocation) : currentLocation,
    destinationLocation: useBackend ? (depots.find(c => c.facilityId === container.computedFields?.destinationLocation)?.name || container.computedFields?.destinationLocation) : destinationLocation,
    idleDays: useBackend ? container.computedFields?.idleDays : idleDays,
    allocationStatus: useBackend ? container.computedFields?.allocationStatus : allocationStatus,
    operationalStatus: useBackend ? container.computedFields?.operationalStatus : operationalStatus,
    customer: useBackend ? (companies.find(c => container.computedFields?.customer === c.companyId)?.name || container.computedFields?.customer) : customer,
    availableFrom: useBackend ? container.computedFields?.availableFrom : availableFrom,
    availableTo: useBackend ? container.computedFields?.availableTo : availableTo,
    status: useBackend ? container.computedFields?.status : status,
    // computed, but based on one particular allocation
    currentStatus: currentAllocationStatus,
    allocFromPlanned: thisAllocation?.validFromActual || thisAllocation?.validFromPlanned || currentOrNextAllocation?.validFromActual || currentOrNextAllocation?.validFromPlanned,
    allocToPlanned: thisAllocation?.validToActual || thisAllocation?.validToPlanned || currentOrNextAllocation?.validToActual || currentOrNextAllocation?.validToPlanned,
    comment: thisAllocation?.comment,
    returnLocation: returnLocation,
    // computed -- but to fix later from BE
    idleCost: useBackend ? undefined : idleCost,
    idleCostForecast: useBackend ? undefined : idleCostForecast,
    leaseRevenue: useBackend ? undefined : leaseRevenue,
    leasesRevenueForecast: useBackend ? undefined : leaseRevenueForecast,
  }
}

export const useContainerStatusMap = (): StatusMap => {
  const theme = useTheme()

  return (new Map([
    [ContainerStatusEnum.Production, { color: theme.palette.error.main, label: 'Production' }],
    ['AVAILABLE', { color: theme.palette.success.main, label: 'Available' }],
    [ContainerStatusEnum.Allocated, { color: theme.palette.error.main, label: 'Allocated' }],
    [ContainerStatusEnum.Mnr, { color: theme.palette.error.main, label: 'M&R' }],
    [ContainerStatusEnum.Intesting, { color: theme.palette.error.main, label: 'In Testing' }],
    [ContainerStatusEnum.Sold, { color: theme.palette.error.main, label: 'Sold' }],
    [ContainerStatusEnum.Blocked, { color: theme.palette.error.main, label: 'Blocked' }],
    [undefined, { color: theme.palette.disabled?.main, label: undefined }],
    ['ALA', { color: theme.palette.warning.main, label: 'Available but allocated' }],
    ['BLA', { color: theme.palette.warning.main, label: 'Blocked but allocated' }],
  ]))
}

export const showAvailableFrom = (availableFrom?: Date, deps?: any[]) => {
  const isBeforeNow = availableFrom ? availableFrom.getTime() < (new Date()).getTime() : false
  return (
    <OverflowTooltip title={availableFrom ? getTimeLabel(availableFrom, 'dateHourWithTz') : ''} deps={deps} >
        <DisableableTypography noWrap variant='body2' sx={{
          ...(isBeforeNow && {
            color: 'red',
          }),
        }}>
        {availableFrom && getTimeLabel(availableFrom)}
      </DisableableTypography>
    </OverflowTooltip>
  )
}

export const showAvailableTo = (availableFrom?: Date, availableTo?: Date, deps?: any[]) => {
  if (availableTo) {
    const availableToText = getTimeLabel(availableTo, 'dateHourWithTz')
    return (<OverflowTooltip title={availableToText} deps={deps} >
      <DisableableTypography noWrap variant='body2'>{availableToText}</DisableableTypography>
    </OverflowTooltip>)
  }
  if (!availableFrom) return (<DisableableTypography noWrap variant='body2'>{undefined}</DisableableTypography>)
  return <AllInclusiveIcon/>
}

// const showDate = (date?: {planned?: string; actual?: string}) => {
//   if (!date || (date && !date.planned && !date.actual)) {
//     return (
//       <DisableableTypography noWrap variant='body2' >
//         {undefined}
//       </DisableableTypography>
//     )
//   }
//   if (date && date.actual) {
//     return (
//       <React.Fragment>
//         <DisableableTypography noWrap variant='body2' sx={{
//           verticalAlign: 'middle',
//           display: 'inline-flex',
//         }}>
//           <EventAvailableIcon sx={{ marginRight: '5px' }}/> {date.actual}
//         </DisableableTypography>
//         {
//           date.planned &&
//           <DisableableTypography noWrap variant='body2' sx={{
//             verticalAlign: 'middle',
//             display: 'inline-flex',
//             color: 'gray',
//           }}>
//             <ScheduleIcon sx={{ marginRight: '5px' }}/>{date.planned}
//           </DisableableTypography>
//         }
//       </React.Fragment>
//     )
//   } else if (date.planned) {
//     return (
//       <React.Fragment>
//         <DisableableTypography noWrap variant='body2' sx={{
//           verticalAlign: 'middle',
//           display: 'inline-flex',
//         }}>
//           <ScheduleIcon sx={{ marginRight: '5px' }}/> {date.planned}
//         </DisableableTypography>
//       </React.Fragment>
//     )
//   }
// }

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.root}`]: {
    padding: '6px 8px 6px 8px',
  },
})

interface ContainerCellProps {
  headCell: TableHeadCell;
  container: ContainerRowDataProps;
  statusMap: StatusMap;
  headerCells: TableHeadCell[];

  onDismissAlerts: (alerts: Alert[]) => void;
  linkTo: boolean;
}

const ContainerCell: React.FC<ContainerCellProps> = ({ headCell, container, statusMap, headerCells, onDismissAlerts, linkTo }) => {
  if (headCell.hide) return null

  const {
    id,
    allocationStatus,
    status,
    operationalStatus,
    allocFromPlanned,
    allocToPlanned,
    availableFrom,
    availableTo,
    orderId,
    alerts,
    idleDays,
    returnLocation,
    containerVersion,
    containerCertificateDate,
    containerDoorType,
    containerFloorType,
    // idleCost,
    // idleCostForecast,
    // leaseRevenue,
    // leasesRevenueForecast,
    comment,
  } = container

  switch (headCell.id) {
    case 'id':
      return (<StyledTableCell >
          <OverflowTooltip title={container.id} deps={[headerCells]} >
            <Typography noWrap variant='body1'>
            {linkTo
              ? <Link href={`/ecosystem/fleet-management/containers?containerId=${id}`}>
                {id}
              </Link>
              : id}
            </Typography>
          </OverflowTooltip>
        </StyledTableCell>)
    case 'operationalStatus': {
      return (<StyledTableCell >
          <Box display='flex' alignItems='center'>
            <ColoredDot color={statusMap.get(status)?.color} />
            <OverflowTooltip title={statusMap.get(status)?.label || ''} deps={[headerCells, container]} >
              <DisableableTypography noWrap variant='body2'>
                {statusMap.get(status)?.label}
              </DisableableTypography>
            </OverflowTooltip>
          </Box>
        </StyledTableCell>)
    }
    case 'allocFromPlanned':
      return (<StyledTableCell >
            <OverflowTooltip title={(allocFromPlanned && getTimeLabel(allocFromPlanned, 'dateHourWithTz')) || ''} deps={[headerCells]} >
      <DisableableTypography noWrap variant='body2'>
      {allocFromPlanned && getTimeLabel(allocFromPlanned)}
    </DisableableTypography>
  </OverflowTooltip>
        </StyledTableCell>)
    case 'allocToPlanned':
      return (<StyledTableCell >
            <OverflowTooltip title={(allocToPlanned && getTimeLabel(allocToPlanned, 'dateHourWithTz')) || ''} deps={[headerCells]} >
      <DisableableTypography noWrap variant='body2'>
      {allocToPlanned && getTimeLabel(allocToPlanned)}
    </DisableableTypography>
  </OverflowTooltip>
        </StyledTableCell>)
    case 'containerCertificateDate':
      return (<OverflowTooltip title={containerCertificateDate ? getTimeLabel(containerCertificateDate, 'dateHourWithTz') : ''} deps={[headerCells]} >
        <DisableableTypography noWrap variant='body2'>
        {containerCertificateDate && getTimeLabel(containerCertificateDate)}
      </DisableableTypography>
    </OverflowTooltip>)
    case 'availableFrom':
      return (<StyledTableCell >
            {showAvailableFrom(availableFrom, [headerCells])}
        </StyledTableCell>)
    case 'availableTo':
      return (<StyledTableCell >
            {showAvailableTo(availableFrom, availableTo, [headerCells])}
        </StyledTableCell>)
    case 'idleDays': {
      const text = idleDays !== undefined ? `${idleDays}` : undefined
      return (<StyledTableCell >
        <OverflowTooltip title={text || ''} deps={[headerCells]} >
            <DisableableTypography noWrap variant='body2'>{text}</DisableableTypography>
          </OverflowTooltip>
    </StyledTableCell>)
    }
    case 'orderId': {
      return (
        <StyledTableCell >
            <OverflowTooltip title={orderId || ''} deps={[headerCells]} >
              <DisableableTypography noWrap variant='body2' sx={{ ...(status !== 'ALLOCATED' && { color: 'gray' }) }}>{orderId}</DisableableTypography>
            </OverflowTooltip>
          </StyledTableCell>
      )
    }
    case 'alerts':
      return (<StyledTableCell sx={{ width: '1px' }}>
          {/* {alerts?.length && <AlertButton alerts={alerts} onDismiss={onDismissAlerts} />} */}
        </StyledTableCell>)
    case 'comment':
      return (<StyledTableCell >
        <OverflowTooltip title={comment || ''} deps={[headerCells.map(hc => hc.id), comment]}>
          <DisableableTypography noWrap variant='body2' >{comment}</DisableableTypography>
        </OverflowTooltip>
        </StyledTableCell>)

    default: return (<StyledTableCell >
        <OverflowTooltip title={container[headCell.id as 'id'] || ''} deps={[headerCells]}>
          <DisableableTypography noWrap variant='body2'>{container[headCell.id as 'id']}</DisableableTypography>
        </OverflowTooltip>
      </StyledTableCell>)
  }
}

export interface ContainerRowDataProps {
  id: string;
  containerId?: string;
  operationalStatus?: ContainerStatusEnum;
  allocationStatus?: any;
  orderId?: string;
  // transitStatus?: string;
  customer?: string;
  // contractualStatus?: string;
  // originDate?: {
  //   planned?: string;
  //   actual?: string;
  // };
  // originLocation?: string;
  // availabilityDate?: {
  //   planned?: string;
  //   actual?: string;
  // };
  // availabilityLocation?: string;
  availableFrom?: Date;
  availableTo?: Date;
  currentLocation?: string;
  destinationLocation?: string;
  returnLocation?: string;
  alerts?: Alert[];
  // moves?: Move[];
  equipmentId: string;
  leases: CurrentLease[];
  idleDays?: number;
  idleCost?: string;
  idleCostForecast?: string;
  leaseRevenue?: string;
  leasesRevenueForecast?: string;
  isActiveAllocation?: boolean;
  contractId?: string;
  currentStatus?: CurrentStatus;
  leaseContractId?: string;
  allocFromPlanned?: Date;
  allocToPlanned?: Date;
  blockingStatuses?: CurrentStatus[];
  containerVersion?: string;
  containerCertificateDate?: Date;
  containerDoorType?: string;
  containerFloorType?: string;
  comment?: string;
  // containerIot?: string; // FIXME
  status?: string;
}
export interface ContainerRowProps extends ContainerRowDataProps {
  headerCells: TableHeadCell[];
  isSelected?: boolean;
  handleRowClick?: (event: React.MouseEvent<unknown>, id: string) => void;
  onDismissAlerts?: (alerts: Alert[]) => void;
  handleCreateMove?: (move: EquipmentMoveInput) => void;
  equipmentsWithLeases?: {equipmentId: string, leases: {value: string, label: string}[]}[];
  noCollapse?: boolean;
  noActions?: boolean;
  // handleToggle: (contractId?: string) => void;
}

const ContainerRow = (props: ContainerRowProps): JSX.Element => {
  const {
    headerCells,
    id,
    orderId,
    operationalStatus,
    allocationStatus,
    customer,
    availableFrom,
    availableTo,
    currentLocation,
    destinationLocation,
    returnLocation,
    alerts,
    isSelected,
    equipmentId,
    leases,
    idleDays,
    idleCost,
    idleCostForecast,
    leaseRevenue,
    leasesRevenueForecast,
    isActiveAllocation,
    contractId,
    handleRowClick,
    onDismissAlerts,
    handleCreateMove,
    equipmentsWithLeases,
    noCollapse,
    noActions,
    currentStatus,
    leaseContractId,
    allocFromPlanned,
    allocToPlanned,
    blockingStatuses,
    containerVersion,
    containerCertificateDate,
    containerDoorType,
    containerFloorType,
    comment,
    status,
  } = props

  const [isActive, setIsActive] = useState(isActiveAllocation)

  const statusMap = useContainerStatusMap()

  const labelId = `enhanced-table-checkbox-${id}`

  const _dispatch = useDispatch()

  const handleToggle = (contractId?: string) => {
    if (contractId) {
      _dispatch(toggleLease(contractId, () => {
        setIsActive(!isActive)
      }))
    }
  }

  const cellProps = {
    id,
    allocationStatus,
    operationalStatus,
    allocFromPlanned,
    allocToPlanned,
    availableFrom,
    availableTo,
    customer,
    orderId,
    currentLocation,
    destinationLocation,
    returnLocation,
    alerts,
    leases,
    idleDays,
    idleCost,
    idleCostForecast,
    leaseRevenue,
    leasesRevenueForecast,
    containerVersion,
    containerCertificateDate,
    containerDoorType,
    containerFloorType,
    comment,
    status,
    equipmentId,
  }

  const statusToModify = blockingStatuses?.find(s => s.equipmentLeaseContractId === currentStatus?.equipmentLeaseContractId) || currentStatus

  return (
    <Fragment>
      <StyledTableRow
        hover
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        selected={isSelected}
        // sx={{ cursor: 'pointer' }}
      >
        {!noCollapse &&
          <TableCell padding="checkbox">
            <Checkbox
              color='primary'
              checked={isSelected}
              inputProps={{ 'aria-labelledby': labelId }}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                if (handleRowClick) handleRowClick(event, id)
              }}
            />
          </TableCell>
        }
        {
          headerCells.filter(h => h.label).map(hc =>
            <ContainerCell
              key={hc.id}
              headerCells={headerCells}
              headCell={hc}
              container={cellProps}
              statusMap={statusMap}
              onDismissAlerts={onDismissAlerts === undefined ? (alerts: any) => {} : onDismissAlerts}
              linkTo={true}
            />).filter(Boolean)
        }
        {noActions !== true &&
          <TableCell padding={'none'} align='center'>
            <Box display='flex' alignItems={'center'} justifyContent={'space-between'} >
              <UpdateStatus
                containerId={id}
                equipmentId={equipmentId || ''}
                statusId={leaseContractId || ''}
                status={statusToModify}
                equipmentLeaseContractId={leaseContractId || ''}
                comment={comment}
              />
              <NewVisContract equipmentLeaseContractId={leaseContractId || ''}/>
              {
                isActive !== undefined && <IconButton size='small' onClick={() => handleToggle(contractId)}>
                  { isActive ? <CancelIcon color='error' /> : <SettingsBackupRestoreIcon color='primary' /> }
                </IconButton>
              }
            </Box>
          </TableCell>
        }
      </StyledTableRow>
    </Fragment>
  )
}

export default ContainerRow
