import React, { Fragment, useEffect, useMemo } from 'react'
import { useTheme, styled } from '@mui/material/styles'
import {
  Box,
  Checkbox,
  TableCell,
  tableCellClasses,
  TableRow,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { DataGridPro, GridColDef, GridToolbarColumnsButton, useGridApiRef } from '@mui/x-data-grid-pro'

import { TableHeadCell } from '../../../../store/ui/types'
import { Alert } from '../../../../services/alerts/types'
import { ContainerStatusEnum } from '../../../../services/equipment/types'
import Typography, { DisableableTypography } from '../../Utils/Typography'
import OverflowTooltip from '../../shared/OverflowTooltip'
import UpdateStatus from '../../Containers/Status/UpdateStatus'
import { CurrentStatus } from '../../../../apis-client'
import GenericTable from '../../shared/GenericTable/Table'
import { AppState } from '../../../../store'
import { getTimeLabel, setDefaultsDataGridState } from '../../shared/utils'
import { StatusMap } from '../ContainerRow'
import { ENABLE_DATAGRID } from '../../../globals'
import { setDatagridState } from '../../../../store/ui/actions'
import { CustomOverflowValue } from '../../shared/CustomOverflowValue'

export const containerDateFormat = 'DD-MM-YYYY'

const StyledTableRow = styled(TableRow)({
  '& > *': {
    borderBottom: 'unset',
  },
})

export const mapToStatusRow = (status: CurrentStatus): StatusRowDataProps => {
  return {
    id: status.statusId,
    equipmentLeaseContractId: status.equipmentLeaseContractId,
    currentStatus: status,
    status: status.status,
    startPlanned: status.validFromPlanned,
    startActual: status.validFromActual,
    stopPlanned: status.validToPlanned,
    stopActual: status.validToActual,
  }
}

const useContainerStatusMap = (): StatusMap => {
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

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.root}`]: {
    padding: '6px 8px 6px 8px',
  },
})

interface ContainerCellProps {
  headCell: TableHeadCell;
  container: StatusRowDataProps;
  statusMap: StatusMap;
  headerCells: TableHeadCell[];

  onDismissAlerts: (alerts: Alert[]) => void;
}

const ContainerCell = ({ headCell, container, statusMap, headerCells, onDismissAlerts }: ContainerCellProps): (JSX.Element | null) => {
  if (headCell.hide) return null

  const {
    id,
    status,
    startPlanned,
    startActual,
    stopPlanned,
    stopActual,
  } = container

  switch (headCell.id) {
    case 'id':
      return (<StyledTableCell >
          <OverflowTooltip title={container.id} deps={[headerCells]} >
            <Typography noWrap variant='body1'>{id}</Typography>
          </OverflowTooltip>
        </StyledTableCell>)
    case 'startPlanned':
      return (<StyledTableCell >
            <OverflowTooltip title={(startPlanned && getTimeLabel(startPlanned, 'dateHourWithTz')) || ''} deps={[headerCells]} >
      <DisableableTypography noWrap variant='body2'>
        {startPlanned && getTimeLabel(startPlanned)}
      </DisableableTypography>
      </OverflowTooltip>
      </StyledTableCell>)
    case 'startActual':
      return (<StyledTableCell >
            <OverflowTooltip title={(startActual && getTimeLabel(startActual, 'dateHourWithTz')) || ''} deps={[headerCells]} >
      <DisableableTypography noWrap variant='body2'>
        {startActual && getTimeLabel(startActual)}
      </DisableableTypography>
      </OverflowTooltip>
      </StyledTableCell>)
    case 'stopPlanned':
      return (<StyledTableCell >
            <OverflowTooltip title={(stopPlanned && getTimeLabel(stopPlanned, 'dateHourWithTz')) || ''} deps={[headerCells]} >
      <DisableableTypography noWrap variant='body2'>
        {stopPlanned && getTimeLabel(stopPlanned)}
      </DisableableTypography>
      </OverflowTooltip>
      </StyledTableCell>)
    case 'stopActual':
      return (<StyledTableCell >
            <OverflowTooltip title={(stopActual && getTimeLabel(stopActual, 'dateHourWithTz')) || ''} deps={[headerCells]} >
      <DisableableTypography noWrap variant='body2'>
       {stopActual && getTimeLabel(stopActual)}
      </DisableableTypography>
      </OverflowTooltip>
      </StyledTableCell>)
    default: return (<StyledTableCell >
        <OverflowTooltip title={container[headCell.id as 'id'] || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1'>{container[headCell.id as 'id']}</DisableableTypography>
        </OverflowTooltip>
      </StyledTableCell>)
  }
}

export interface StatusRowDataProps {
  id: string;
  currentStatus?: CurrentStatus;
  status?: any;
  startPlanned?: Date;
  startActual?: Date;
  stopPlanned?: Date;
  stopActual?: Date;
  equipmentLeaseContractId?: string;
}
export interface StatusRowProps extends StatusRowDataProps {
  headerCells: TableHeadCell[];
  isSelected?: boolean;
  handleRowClick?: (event: React.MouseEvent<unknown>, id: string) => void;
  onDismissAlerts?: (alerts: Alert[]) => void;
  equipmentsWithLeases?: {equipmentId: string, leases: {value: string, label: string}[]}[];
  noCollapse?: boolean;
  noActions?: boolean;
  equipmentId?: string;
  orderId?: string;
}

const StatusRow = (props: StatusRowProps): JSX.Element => {
  const {
    headerCells,
    id,
    equipmentId,
    status,
    startPlanned,
    startActual,
    stopPlanned,
    stopActual,
    isSelected,
    handleRowClick,
    onDismissAlerts,
    noCollapse,
    noActions,
    currentStatus,
    orderId,
  } = props

  const statusMap = useContainerStatusMap()

  const labelId = `enhanced-table-checkbox-${id}`

  const cellProps = {
    id,
    status,
    startPlanned,
    startActual,
    stopPlanned,
    stopActual,
    orderId,
  }

  return (
    <Fragment>
      <StyledTableRow
        hover
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        selected={isSelected}
        sx={{ cursor: 'pointer' }}
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
            />).filter(Boolean)
        }
        {noActions !== true &&
          <TableCell padding={'none'} align='center'>
            <Box display='flex' alignItems={'center'} justifyContent={'space-between'} mb={1}>
              <UpdateStatus equipmentId={equipmentId || ''} statusId={currentStatus?.statusId || ''} status={currentStatus} throughLease={false}/>
            </Box>
          </TableCell>
        }
      </StyledTableRow>
    </Fragment>
  )
}

const NoData = () => {
  return (
    <Box margin={'4px auto'} width='80%'>
      <Typography align='center' variant='subtitle2'>{'There are no allocations yet.'}</Typography>
    </Box>
  )
}

export const inititalContainerHeadCells: TableHeadCell[] = [
  { id: 'id', isSortable: true, label: 'Status ID', hide: false },
  { id: 'status', isSortable: true, label: 'Status', hide: false },
  { id: 'orderId', isSortable: true, label: 'Order id', hide: false },
  { id: 'startPlanned', isSortable: true, label: 'startPlanned', hide: false },
  { id: 'startActual', isSortable: true, label: 'startActual', hide: false },
  { id: 'stopPlanned', isSortable: true, label: 'stopPlanned', hide: false },
  { id: 'stopActual', isSortable: true, label: 'stopActual', hide: false },
  { id: 'actions', isSortable: false, align: 'center', label: null, width: 64 },
]

interface StatusTableProps {
  equipmentId: string;
  // statuses?: CurrentStatus[];
}

const StatusTable = ({ equipmentId }: StatusTableProps) => {
  const apiRef = useGridApiRef()
  const { equipments } = useSelector((state: AppState) => state.equipment)
  const { allocations } = useSelector((state: AppState) => state.equipment)
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)

  const filteredAllocations = allocations.filter(m => m.equipmentId === equipmentId)

  const equipment = equipments.find(e => {
    return e.equipmentId === equipmentId
  })
  // const statuses: CurrentStatus[] = !equipment ? [] : [...equipment.currentStatus ? [equipment.currentStatus] : [], ...equipment.futureStatuses ? equipment.futureStatuses : []]
  const statuses: CurrentStatus[] = !equipment ? [] : (equipment.blockingStatuses || [])

  const orderIdHandler = (row: StatusRowProps): string | undefined => filteredAllocations.find((a) => a.equipmentstatus?.statusId === row.id)?.orderId || undefined

  const columns = useMemo(() => [
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      hideable: false,
      filterable: false,
      minWidth: 70,
      renderHeader: () => (
        <GridToolbarColumnsButton style={{ minWidth: 36 }} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
      ),
      renderCell: (params: {row: StatusRowProps}) => {
        return (
          <Box display='flex' alignItems={'center'} justifyContent={'space-between'} mb={1}>
            <UpdateStatus
              equipmentId={equipmentId || ''}
              statusId={params.row.currentStatus?.statusId || ''}
              status={params.row.currentStatus}
              throughLease={false}
              containerId={equipment?.container?.containerId}
            />
          </Box>
        )
      },
      flex: 0.5,
    },
    {
      field: 'id',
      headerName: 'Status ID',
      renderCell: (params: {row: StatusRowProps}) => (
        <CustomOverflowValue dataKey={'containersStatuses'} value={params.row.id} />
      ),
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (params: {row: StatusRowProps}) => (
        <CustomOverflowValue dataKey={'containersStatuses'} value={params.row.status} />
      ),
      flex: 1,
    },
    {
      field: 'orderId',
      headerName: 'Order id',
      renderCell: (params: {row: StatusRowProps}) => (
        <CustomOverflowValue dataKey={'containersStatuses'} value={orderIdHandler(params.row)} />
      ),
      flex: 1,
    },
    {
      field: 'startPlanned',
      headerName: 'startPlanned',
      renderCell: (params: {row: StatusRowProps}) => (
        <CustomOverflowValue dataKey={'containersStatuses'} value={params.row.startPlanned ? getTimeLabel(params.row.startPlanned, 'dateHourWithTz') : undefined} />
      ),
      flex: 1,
    },
    {
      field: 'startActual',
      headerName: 'startActual',
      renderCell: (params: {row: StatusRowProps}) => (
        <CustomOverflowValue dataKey={'containersStatuses'} value={params.row.startActual ? getTimeLabel(params.row.startActual, 'dateHourWithTz') : undefined} />
      ),
      flex: 1,
    },
    {
      field: 'stopPlanned',
      headerName: 'stopPlanned',
      renderCell: (params: {row: StatusRowProps}) => (
        <CustomOverflowValue dataKey={'containersStatuses'} value={params.row.stopPlanned ? getTimeLabel(params.row.stopPlanned, 'dateHourWithTz') : undefined} />
      ),
      flex: 1,
    },
    {
      field: 'stopActual',
      headerName: 'stopActual',
      renderCell: (params: {row: StatusRowProps}) => (
        <CustomOverflowValue dataKey={'containersStatuses'} value={params.row.stopActual ? getTimeLabel(params.row.stopActual, 'dateHourWithTz') : undefined} />
      ),
      flex: 1,
    },
  ] as GridColDef[],
  [])

  useEffect(() => {
    if (ENABLE_DATAGRID && datagridState?.containersStatuses) {
      apiRef.current.restoreState(setDefaultsDataGridState(datagridState.containersStatuses))
    }
  }, [])

  const _dispatch = useDispatch()

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, containersStatuses: columnState }))
  }

  return (
    <Box id='container-status-table-wrapper' sx={{ overflowY: 'auto' }} display='flex' flexDirection={'column'} maxHeight='40vh'>
      <Box display='flex' alignItems={'center'} justifyContent={'space-between'} height={'40vh'}>
        { ENABLE_DATAGRID
          ? <DataGridPro
            apiRef={ apiRef }
            initialState={{ columns: { columnVisibilityModel: {} } }}
            localeText={{ toolbarColumns: '' }}
            disableSelectionOnClick
            onColumnOrderChange={ handleDispatch }
            onColumnVisibilityModelChange={ handleDispatch }
            onColumnWidthChange={ handleDispatch }
            onPinnedColumnsChange={ handleDispatch }
            onSortModelChange={ handleDispatch }
            columns={ columns }
            rows={ statuses.map(mapToStatusRow) }
            getRowId={ row => row.id }
          />
          : <GenericTable
            headerCells={inititalContainerHeadCells}
            order={'asc'}
            orderBy={'startPlanned'}
            rows={statuses.map(mapToStatusRow)}
            handleSelectAllClick={() => {}}
            disableSelect
            noDataComponent={<NoData />}
            rowComponent={({ ...row }: StatusRowProps) => (
              <StatusRow
                {...row}
                headerCells={inititalContainerHeadCells}
                // handleRowClick={handleRowClick}
                // isSelected={isSelected(row.id)}
                // onDismissAlerts={handleDismissAlerts}
                // handleCreateMove={handleCreateMove}
                // equipmentsWithLeases={equipmentsWithLeases}
                noCollapse={true}
                equipmentId={equipmentId}
                orderId={orderIdHandler(row)}
              />
            )}
          />
        }
      </Box>
    </Box>
  )
}

export default StatusTable
