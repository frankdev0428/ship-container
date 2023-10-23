import React, { Fragment, useState } from 'react'
import { useTheme, styled } from '@mui/material/styles'
import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  TableCell,
  tableCellClasses,
  TableRow,
  Tooltip,
} from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import WarningIcon from '@mui/icons-material/Warning'
import moment from 'moment'

import { TableHeadCell } from '../../../store/ui/types'
import { Alert } from '../../../services/alerts/types'
import { Equipment, ContainerStatusEnum } from '../../../services/equipment/types'
import { Company } from '../../../services/customer/types'
import { Facility } from '../../../services/places/types'
import { StorageRate, LeaseRate } from '../../../services/financials/types'
import { CurrentLease } from '../../../services/lease/types'
import { EquipmentMoveInput } from '../../../services/move/types'
import Typography, { DisableableTypography } from '../Utils/Typography'
import OverflowTooltip from '../shared/OverflowTooltip'
import { getCurrencySymbol } from '../shared/currencySymbols'
import { NewlyCreatedNotif, TableRowUiProps } from '../shared/GenericTable/Table'
import { getTimeLabel } from '../shared/utils'
import { ColoredDot } from '../shared/ColoredDot'
import CollapsibleRow from '../shared/GenericTable/CollapsibleRow'
import { LatestMessage } from '../../../services/boards/types'
import LatestMessageCell from '../Boards/LatestMessageCell'
import { computeEquipmentStatus } from '../computeEquipmentStatus'

import AlertButton from './Alert/AlertButton'
import ContainerData from './ContainerCollapsedData/ContainerData'

export const containerDateFormat = 'DD-MM-YYYY'

const StyledTableRow = styled(TableRow)({
  height: 40,
  // '& > *': {
  //   borderBottom: 'unset',
  // },
})

export const mapToContainerRow = (container: Equipment, companies: Company[], depots: Facility[], storage?: StorageRate[], lease?: LeaseRate[], useBackend?: boolean): ContainerRowDataProps => {
  const {
    status,
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
    daysOverdue,
    orderId,
  } = computeEquipmentStatus(container, companies, depots, storage, lease)

  return {
    id: container.aelerContainerId || container.equipmentId,
    createdAt: container.container?.createdAt,
    alerts: [],
    equipmentId: container.equipmentId,
    leases: [
      ...(container.currentLease ? [container.currentLease] : []),
      ...(container.futureLeases ? container.futureLeases : []),
    ],
    isNewlyInserted: container.isNewlyInserted,
    containerVersion: container.container?.containerVersion,
    containerCertificateDate: container.container?.cscCertDate,
    containerDoorType: container.container?.doorType,
    containerFloorType: container.container?.floorType,
    /* computed state, that can be fetched from BE */
    orderId: useBackend ? container.computedFields?.orderId : orderId,
    currentLocation: useBackend ? (depots.find(c => c.facilityId === container.computedFields?.currentLocation)?.name || container.computedFields?.currentLocation) : currentLocation,
    destinationLocation: useBackend ? (depots.find(c => c.facilityId === container.computedFields?.destinationLocation)?.name || container.computedFields?.destinationLocation) : destinationLocation,
    idleDays: useBackend ? container.computedFields?.idleDays : idleDays,
    daysOverdue: useBackend ? container.computedFields?.daysOverdue : daysOverdue,
    allocationStatus: useBackend ? container.computedFields?.allocationStatus : allocationStatus,
    operationalStatus: useBackend ? container.computedFields?.operationalStatus : operationalStatus,
    customer: useBackend ? (companies.find(c => container.computedFields?.customer === c.companyId)?.name || container.computedFields?.customer) : customer,
    availableFrom: useBackend ? container.computedFields?.availableFrom : availableFrom,
    availableTo: useBackend ? container.computedFields?.availableTo : availableTo,
    status: useBackend ? container.computedFields?.status : status,
    // computed -- but to fix later from BE
    idleCost: useBackend ? undefined : idleCost,
    idleCostForecast: useBackend ? undefined : idleCostForecast,
    leaseRevenue: useBackend ? undefined : leaseRevenue,
    leasesRevenueForecast: useBackend ? undefined : leaseRevenueForecast,
    isWarning: container.warnings?.hasMissingStopActual || container.warnings?.hasStartBeforeStop,
  }
}

export type StatusMap = Map<string | undefined, { color?: string; label?: string; }>

export const useContainerStatusMap = (): StatusMap => {
  const theme = useTheme()

  return (new Map([
    [ContainerStatusEnum.Production, { color: theme.palette.warning.main, label: 'Production' }],
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
  const isAfterNow = availableFrom ? availableFrom.getTime() > (new Date()).getTime() : false
  return (
    <OverflowTooltip title={availableFrom ? getTimeLabel(availableFrom, 'dateHourWithTz') : ''} deps={deps} >
        <DisableableTypography noWrap variant='body2' sx={{
          ...(isAfterNow && {
            color: 'red',
          }),
        }}>
        {availableFrom ? getTimeLabel(availableFrom) : undefined}
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
  return <AllInclusiveIcon fontSize='small' viewBox='0 0 24 18'/>
}

const showCreatedAt = (createdAt?: Date, deps?: any[]) => {
  if (createdAt) {
    const createdAtText = getTimeLabel(createdAt, 'dateHourWithTz')
    return (<OverflowTooltip title={createdAtText} deps={deps} >
      <DisableableTypography noWrap variant='body2'>{createdAtText}</DisableableTypography>
    </OverflowTooltip>)
  } else { return <DisableableTypography noWrap variant='body2' /> }
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
}

export const ContainerCell = ({ headCell, container, statusMap, headerCells, onDismissAlerts }: ContainerCellProps): (JSX.Element | null) => {
  if (headCell.hide) return null

  const {
    id,
    createdAt,
    status,
    allocationStatus,
    operationalStatus,
    availableFrom,
    availableTo,
    orderId,
    alerts,
    idleDays,
    // idleCost,
    // idleCostForecast,
    // leaseRevenue,
    // leasesRevenueForecast,
    containerVersion,
    containerCertificateDate,
    containerDoorType,
    containerFloorType,
    daysOverdue,
    boardLatestMessage,
    isBoardPaired,
    isWarning,
  } = container

  switch (headCell.id) {
    case 'id':
      return (<StyledTableCell sx={{ position: 'relative' }}>
          {isWarning
            ? <Tooltip title={'Error in timeline'}>
                <WarningIcon color='error'/>
              </Tooltip>
            : ''}
          <OverflowTooltip title={container.id} deps={[headerCells]} >
            <Typography noWrap variant='body2'>{id}</Typography>
          </OverflowTooltip>
        </StyledTableCell>)
    case 'createdAt':
      return (<StyledTableCell >
                {showCreatedAt(createdAt, headerCells)}
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
    case 'daysOverdue': {
      const dod = daysOverdue
      const isWarning = dod && dod > 0

      return (<StyledTableCell >
        <Box display='flex' alignItems='left'>
          <OverflowTooltip title={dod || ''} deps={[headerCells]} >
            <DisableableTypography noWrap variant='body2'>{dod}</DisableableTypography>
          </OverflowTooltip>
          {isWarning
            ? <Tooltip title={'Container is overdue'}>
                <WarningIcon color='error'/>
              </Tooltip>
            : ''}
        </Box>
      </StyledTableCell>)
    }
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
    case 'boardLatestMessage':
      return (<StyledTableCell>
          <LatestMessageCell latestMessage={boardLatestMessage} isBoardPaired={isBoardPaired}/>
        </StyledTableCell>)
    case 'alerts':
      return (<StyledTableCell sx={{ width: '1px' }}>
          {alerts?.length && <AlertButton alerts={alerts} onDismiss={onDismissAlerts} />}
        </StyledTableCell>)
    default: return (<StyledTableCell >
        <OverflowTooltip title={container[headCell.id as 'id'] || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body2'>{container[headCell.id as 'id']}</DisableableTypography>
        </OverflowTooltip>
      </StyledTableCell>)
  }
}

export interface ContainerRowDataProps extends TableRowUiProps {
  id: string;
  createdAt?: Date;
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
  alerts?: Alert[];
  // moves?: Move[];
  equipmentId?: string;
  leases: CurrentLease[];
  idleDays?: number;
  idleCost?: string;
  idleCostForecast?: string;
  leaseRevenue?: string;
  leasesRevenueForecast?: string;
  daysOverdue?: number;
  containerVersion?: string;
  containerCertificateDate?: Date;
  containerDoorType?: string;
  containerFloorType?: string;
  // containerIot?: string; // FIXME
  boardLatestMessage?: LatestMessage;
  isBoardPaired?: boolean;
  status?: string;
  isWarning?: boolean;
}
export interface ContainerRowProps extends ContainerRowDataProps {
  headerCells: TableHeadCell[];
  isSelected?: boolean;
  handleRowClick?: (event: React.MouseEvent<unknown>, id: string) => void;
  onDismissAlerts?: (alerts: Alert[]) => void;
  handleCreateMove?: (move: EquipmentMoveInput) => void;
  equipmentsWithLeases?: {equipmentId: string, leases: {value: string, label: string}[]}[];
  noCollapse?: boolean;
}

const ContainerRow = (props: ContainerRowProps): JSX.Element => {
  const {
    headerCells,
    id,
    createdAt,
    orderId,
    operationalStatus,
    allocationStatus,
    customer,
    // transitStatus,
    // contractualStatus,
    // originDate,
    // originLocation,
    // availabilityDate,
    // availabilityLocation,
    availableFrom,
    availableTo,
    currentLocation,
    destinationLocation,
    alerts,
    // moves,
    isSelected,
    equipmentId,
    leases,
    idleDays,
    idleCost,
    idleCostForecast,
    leaseRevenue,
    leasesRevenueForecast,
    daysOverdue,
    handleRowClick,
    onDismissAlerts,
    handleCreateMove,
    equipmentsWithLeases,
    noCollapse,
    isNewlyInserted,
    containerVersion,
    containerCertificateDate,
    containerDoorType,
    containerFloorType,
    boardLatestMessage,
    isBoardPaired,
  } = props

  const [open, setOpen] = useState(false)
  const theme = useTheme()

  const statusMap = useContainerStatusMap()

  const labelId = `enhanced-table-checkbox-${id}`

  const handleDropdown = (open: boolean) => {
    setOpen(open)
  }

  const cellProps = {
    id,
    createdAt,
    allocationStatus,
    operationalStatus,
    availableFrom,
    availableTo,
    customer,
    orderId,
    // transitStatus,
    // originLocation: origin.depot,
    // originDate: origin.date,
    // availabilityLocation: availability.depot,
    // availabilityDate: availability.date,
    currentLocation,
    destinationLocation,
    alerts,
    leases,
    idleDays,
    idleCost,
    idleCostForecast,
    leaseRevenue,
    leasesRevenueForecast,
    daysOverdue,
    containerVersion,
    containerCertificateDate,
    containerDoorType,
    containerFloorType,
    isBoardPaired,
    boardLatestMessage,
  }

  return (
    <Fragment>
      <StyledTableRow
        hover
        onClick={() => handleDropdown(!open)}
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        selected={isSelected}
        sx={{ cursor: 'pointer' }}
      >
        {!noCollapse &&
          <TableCell padding="checkbox" sx={{ position: 'relative' }}>
            { isNewlyInserted && <NewlyCreatedNotif />}
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
          headerCells.filter(h => h.id !== 'table-actions').map(hc =>
            <ContainerCell
              key={hc.id}
              headerCells={headerCells}
              headCell={hc}
              container={cellProps}
              statusMap={statusMap}
              onDismissAlerts={onDismissAlerts === undefined ? (alerts: any) => {} : onDismissAlerts}
            />).filter(Boolean)
        }
        {!noCollapse &&
          <TableCell padding={'none'} align='center'>
            <IconButton size='small' color='primary'>
              { open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </TableCell>
        }
      </StyledTableRow>
      {!noCollapse &&
        <CollapsibleRow open={open} colSpan={headerCells.filter(h => !h.hide).length + 1}>
          <ContainerData
            handleCreateMove={handleCreateMove === undefined ? (move: any) => {} : handleCreateMove}
            equipmentId={equipmentId || ''}
            equipmentsWithLeases={equipmentsWithLeases || []}
            leases={leases}
            containerId={id}
            />
        </CollapsibleRow>
        // <TableRow sx={{ backgroundColor: open ? '#f9f9fb' : undefined }} >
        //   <TableCell padding='checkbox' sx={{ ...open && { backgroundColor: '#f9f9fb' } }} colSpan={headerCells.filter(h => !h.hide).length + 1}>
        //     <Collapse in={open} timeout="auto" unmountOnExit>
        //       <ContainerData
        //         handleCreateMove={handleCreateMove === undefined ? (move: any) => {} : handleCreateMove}
        //         equipmentId={equipmentId || ''}
        //         equipmentsWithLeases={equipmentsWithLeases || []}
        //         leases={leases}
        //         containerId={id}
        //         />
        //     </Collapse>
        //   </TableCell>
        // </TableRow>
      }
      {/* {canDisallocate &&
        <TableCell padding={'none'} align='center'>
          { allocation.active !== undefined && <IconButton size='small' onClick={() => handleToggle(allocation.contractId)}>
            { allocation.active ? <CancelIcon color='error' /> : <SettingsBackupRestoreIcon color='primary' /> }
          </IconButton> }
        </TableCell>
      } */}
    </Fragment>
  )
}

export default ContainerRow
