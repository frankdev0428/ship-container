import React, { Fragment, useEffect, useMemo } from 'react'
import { useTheme, styled } from '@mui/material/styles'
import {
  Box,
  Checkbox,
  TableCell,
  TableRow,
  Link,
  tableCellClasses,
} from '@mui/material'
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { ChevronLeft, ChevronRight, ExpandMore } from '@mui/icons-material'
import { DataGridPro, GridColDef, GridToolbarColumnsButton, useGridApiRef } from '@mui/x-data-grid-pro'

import { TableHeadCell } from '../../../../store/ui/types'
import { Alert } from '../../../../services/alerts/types'
import { Equipment, ContainerStatusEnum } from '../../../../services/equipment/types'
import Typography, { DisableableTypography } from '../../Utils/Typography'
import OverflowTooltip from '../../shared/OverflowTooltip'
import GenericTable from '../../shared/GenericTable/Table'
import { AppState } from '../../../../store'
import { getTimeLabel, setDefaultsDataGridState } from '../../shared/utils'
import { listDepotsInventory } from '../../../../services/places/actions'
import { DepotContainer } from '../../../../services/places/types'
import { StatusMap } from '../../Containers/ContainerRow'
import { ColoredDot } from '../../shared/ColoredDot'
import { ENABLE_DATAGRID } from '../../../globals'
import { setDatagridState } from '../../../../store/ui/actions'
import { listEquipments } from '../../../../services/equipment/actions'
import { CustomOverflowValue } from '../../shared/CustomOverflowValue'

export const containerDateFormat = 'DD-MM-YYYY'

const StyledTableRow = styled(TableRow)({
  '& > *': {
    borderBottom: 'unset',
  },
})

export const mapToInventoryRow = (container: DepotContainer, equipment: Equipment): InventoryRowDataProps => {
  const DELAY_DEPARTURE = 90 // days
  const status = container.depotOutDate ? (Math.abs(moment().diff(moment(container.depotOutDate), 'days')) > DELAY_DEPARTURE ? container.depotStatus : 'DEPARTING') : container.depotStatus

  const containerStatus = container.status
  // ? (container.status === 'ALLOCATED'
  //     ? 'ALLOCATED'
  //     : (
  //         (container.status as any) === null ? 'ALA' : 'BLA'
  //       ))
  // : container.status

  return {
    id: container.aelerContainerId,
    depotStatus: status,
    depotInDate: container.depotInDate,
    depotOutDate: container.depotOutDate,
    containerStatus: containerStatus,
    daysIdle: container.secondsIdle && Math.round(container.secondsIdle / (3600 * 24)),
    containerFloorType: equipment.container?.floorType,
    containerDoorType: equipment.container?.doorType,
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
  container: InventoryRowDataProps;
  statusMap: StatusMap;
  headerCells: TableHeadCell[];

  onDismissAlerts: (alerts: Alert[]) => void;
}

const getDepotStatusLabel = (status?: string): { label: string, color?: string, icon: any } => {
  const theme = useTheme()

  return new Map([
    ['ARRIVING', { label: 'Arriving', color: theme.palette.success.main, icon: <ChevronRight sx={{ color: theme.palette.success.main }}/> }],
    ['AT_DEPOT', { label: 'At Depot', color: theme.palette.primary.main, icon: <ExpandMore sx={{ color: theme.palette.primary.main }}/> }],
    ['DEPARTING', { label: 'Departing', color: theme.palette.error.main, icon: <ChevronLeft sx={{ color: theme.palette.error.main }}/> }],
  ]).get(status || '') || { label: 'Unknown', color: theme.palette.disabled?.main, icon: ChevronLeft }
}

const ContainerCell = ({ headCell, container, statusMap, headerCells, onDismissAlerts }: ContainerCellProps): (JSX.Element | null) => {
  if (headCell.hide) return null

  const {
    id,
    depotStatus,
    depotInDate,
    depotOutDate,
    containerStatus,
    daysIdle,
  } = container

  const linkTo = true

  switch (headCell.id) {
    case 'id':
      return (<StyledTableCell >
          <OverflowTooltip title={container.id} deps={[headerCells]} >
            <Typography noWrap variant='body1' >
              {linkTo
                ? <Link href={`/ecosystem/fleet-management/containers?containerId=${id}`}>
                {id}
              </Link>
                : id}
            </Typography>
          </OverflowTooltip>
        </StyledTableCell>)
    case 'depotInDate':
      return (<StyledTableCell >
            <OverflowTooltip title={(depotInDate && getTimeLabel(depotInDate, 'dateHourWithTz')) || ''} deps={[headerCells]} >
      <DisableableTypography noWrap variant='body2'>
        {depotInDate && getTimeLabel(depotInDate)}
      </DisableableTypography>
      </OverflowTooltip>
      </StyledTableCell>)
    case 'depotOutDate':
      return (<StyledTableCell >
        {depotOutDate
          ? <OverflowTooltip title={(depotOutDate && getTimeLabel(depotOutDate, 'dateHourWithTz')) || ''} deps={[headerCells]} >
                <DisableableTypography noWrap variant='body2'>
                  {depotOutDate && getTimeLabel(depotOutDate)}
                </DisableableTypography>
                </OverflowTooltip>
          : <AllInclusiveIcon fontSize='small' viewBox='0 0 24 18'/>
        }
      </StyledTableCell>)
    case 'containerStatus': {
      return (<StyledTableCell >
          <Box display='flex' alignItems='center'>
            <ColoredDot color={statusMap.get(containerStatus)?.color} />
            <OverflowTooltip title={statusMap.get(containerStatus)?.label || ''} deps={[headerCells, container]} >
              <DisableableTypography noWrap variant='body2'>
                {statusMap.get(containerStatus)?.label}
              </DisableableTypography>
            </OverflowTooltip>
          </Box>
        </StyledTableCell>)
    }
    case 'depotStatus': {
      const info = getDepotStatusLabel(depotStatus)
      return (<StyledTableCell sx={{ display: 'flex' }} >
        {info.icon}
            <OverflowTooltip title={(depotStatus && info.label) || ''} deps={[headerCells]} >
      <DisableableTypography noWrap variant='body2' sx={{ color: info.color }}>
        {depotStatus && info.label}
      </DisableableTypography>
      </OverflowTooltip>
      </StyledTableCell>)
    }
    default: return (<StyledTableCell >
        <OverflowTooltip title={container[headCell.id as 'id'] || ''} deps={[headerCells]} >
          <DisableableTypography noWrap variant='body1'>{container[headCell.id as 'id']}</DisableableTypography>
        </OverflowTooltip>
      </StyledTableCell>)
  }
}

export interface InventoryRowDataProps {
  id: string;
  depotStatus?: string;
  depotInDate?: Date;
  depotOutDate?: Date;
  containerStatus?: string;
  daysIdle?: number;
  containerFloorType?: string;
  containerDoorType?: string;
}
export interface InventoryRowProps extends InventoryRowDataProps {
  headerCells: TableHeadCell[];
  isSelected?: boolean;
  handleRowClick?: (event: React.MouseEvent<unknown>, id: string) => void;
  onDismissAlerts?: (alerts: Alert[]) => void;
  equipmentsWithLeases?: {facilityId: string, leases: {value: string, label: string}[]}[];
  noCollapse?: boolean;
  noActions?: boolean;
  facilityId?: string;
}

const InventoryRow = (props: InventoryRowProps): JSX.Element => {
  const {
    headerCells,
    id,
    facilityId,
    depotStatus,
    depotInDate,
    depotOutDate,
    containerStatus,
    daysIdle,
    containerFloorType,
    containerDoorType,
    isSelected,
    handleRowClick,
    onDismissAlerts,
    noCollapse,
    noActions,
  } = props

  const statusMap = useContainerStatusMap()

  const labelId = `enhanced-table-checkbox-${id}`

  const cellProps = {
    id,
    depotStatus,
    depotInDate,
    depotOutDate,
    containerStatus,
    daysIdle,
    containerDoorType,
    containerFloorType,
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
      </StyledTableRow>
    </Fragment>
  )
}

const NoData = () => {
  return (
    <Box margin={'4px auto'} width='80%'>
      <Typography align='center' variant='subtitle2'>{'There are no containers in depot.'}</Typography>
    </Box>
  )
}

export const inititalContainerHeadCells: TableHeadCell[] = [
  { id: 'depotStatus', isSortable: true, label: 'Status', hide: false },
  { id: 'id', isSortable: true, label: 'Container N°', hide: false },
  { id: 'depotInDate', isSortable: true, label: 'Depot In', hide: false },
  { id: 'depotOutDate', isSortable: true, label: 'Depot Out', hide: false },
  { id: 'daysIdle', isSortable: true, label: 'Total days idle', hide: false },
  { id: 'containerStatus', isSortable: true, label: 'Status', hide: false }, // this is not working fine yet...
  // { id: 'stopActual', isSortable: true, label: 'Daily cost', hide: false },
  { id: 'actions', isSortable: false, align: 'center', label: null, width: 64 },
]

interface InventoryTableProps {
  facilityId: string;
}

const InventoryTable = ({ facilityId }: InventoryTableProps) => {
  const apiRef = useGridApiRef()
  const containersForDepots = useSelector((state: AppState) => state.places.containers)
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)

  // const equipment = equipments.find(e => e.facilityId === facilityId)
  const containers: DepotContainer[] = containersForDepots.find(c => c.depotId === facilityId)?.containers || []
  const boards = useSelector((state: AppState) => state.boards.boards)
  const equipments = useSelector((state: AppState) => state.equipment.equipments)
  const { shouldUseBackend } = useSelector((state: AppState) => state.settings)

  const containerRows = containers?.map(container => {
    const e = equipments.find(e => container.equipmentId === e.equipmentId)
    if (!e) return undefined
    return mapToInventoryRow(container, e)
  }).filter(container => container !== undefined)

  const boardsPaired = boards.filter((b) => b.containerIds && b.containerIds?.length > 0)

  const _dispatch = useDispatch()

  useEffect(() => {
    // _dispatch(listDepotsInventory(facilityId))
    // _dispatch(listEquipments({}, shouldUseBackend))
    // _dispatch(listBoards())
    if (ENABLE_DATAGRID && datagridState?.facilitiesContainers) {
      apiRef.current.restoreState(setDefaultsDataGridState(datagridState.facilitiesContainers))
    }
  }, [])

  useEffect(() => {
    _dispatch(listDepotsInventory(facilityId, shouldUseBackend))
    _dispatch(listEquipments({}, shouldUseBackend))
  }, [shouldUseBackend])

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, facilitiesContainers: columnState }))
  }

  const statusMap = useContainerStatusMap()

  const columns = useMemo(() => [
    {
      field: 'actions',
      hideable: false,
      sortable: false,
      filterable: false,
      headerName: 'Actions',
      minWidth: 70,
      renderHeader: () => (
        <GridToolbarColumnsButton style={{ minWidth: 36 }} onResize={undefined} nonce={undefined} onResizeCapture={undefined} />
      ),
    },
    {
      field: 'depotStatus',
      headerName: 'Status',
      renderCell: (params: {row: InventoryRowProps}) => {
        const info = getDepotStatusLabel(params.row.depotStatus)
        return (
          <Box display='flex' alignItems='center' overflow='hidden'>
            {info.icon}
            <CustomOverflowValue
              dataKey={'facilitiesContainers'}
              value={params.row.depotStatus ? info.label : undefined}
              typographyColor={info.color}
            />
          </Box>
        )
      },
      flex: 1,
    },
    {
      field: 'id',
      headerName: 'Container N°',
      renderCell: (params: {row: InventoryRowProps}) => (
        <CustomOverflowValue
          dataKey={'facilitiesContainers'}
          value={params.row.id} to={`/ecosystem/fleet-management/containers?containerId=${params.row.id}`}
          isLink
        />
      ),
      flex: 1,
    },
    {
      field: 'depotInDate',
      headerName: 'Depot In',
      renderCell: (params: {row: InventoryRowProps}) => (
        <CustomOverflowValue
          dataKey={'facilitiesContainers'}
          value={params.row.depotInDate ? getTimeLabel(params.row.depotInDate, 'dateHourWithTz') : undefined}
        />
      ),
      flex: 1,
    },
    {
      field: 'depotOutDate',
      headerName: 'Depot Out',
      renderCell: (params: {row: InventoryRowProps}) => {
        if (params.row.depotOutDate) {
          return (
            <CustomOverflowValue
              dataKey={'facilitiesContainers'}
              value={params.row.depotOutDate ? getTimeLabel(params.row.depotOutDate, 'dateHourWithTz') : undefined}
            />
          )
        } else {
          return <AllInclusiveIcon fontSize='small' viewBox='0 0 24 18'/>
        }
      },
      flex: 1,
    },
    {
      field: 'daysIdle',
      headerName: 'Total days idle',
      renderCell: (params: {row: InventoryRowProps}) => (
        <CustomOverflowValue dataKey={'facilitiesContainers'} value={params.row.daysIdle } />
      ),
      flex: 1,
    },
    {
      field: 'containerStatus',
      headerName: 'Status',
      renderCell: (params: {row: InventoryRowProps}) => (
        <Box display='flex' alignItems='center' overflow='hidden'>
          <ColoredDot color={statusMap.get(params.row.containerStatus)?.color} />
          <CustomOverflowValue dataKey={'facilitiesContainers'} value={statusMap.get(params.row.containerStatus)?.label} />
        </Box>
      ),
      flex: 1,
    },
    {
      field: 'containerDoorType',
      headerName: 'TIR locking plate',
      renderCell: (params: { row: InventoryRowProps }) =>
        <CustomOverflowValue dataKey={'facilitiesContainers'} value={params.row.containerDoorType } />,
    },
    {
      field: 'containerFloorType',
      headerName: 'Floor insulation',
      renderCell: (params: { row: InventoryRowProps }) =>
        <CustomOverflowValue dataKey={'facilitiesContainers'} value={params.row.containerFloorType } />,
    },
    // {
    //   field: 'boardLatestMessage',
    //   headerName: 'Working board paired?',
    //   renderCell: (params: { row: InventoryRowProps }) =>
    //   <LatestMessageCell
    //     latestMessage={boardsPaired.find((b) => b.provider === 'aeler' && b.containerIds && params.row.id && b.containerIds.includes(params.row.id))?.latestMessage}
    //     isBoardPaired={!!boardsPaired.find((b) => b.containerIds && b.containerIds.includes(params.row.id))}
    //   />,
    // },
  ] as GridColDef[],
  [])

  return (
    <Box id='moves-table-wrapper' sx={{ overflowY: 'auto' }} display='flex' flexDirection={'column'} maxHeight='40vh'>
      <Box display='flex' alignItems={'center'} justifyContent={'space-between'} height='40vh'>
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
            rows={ containerRows }
            getRowId={ row => row.id }
          />
          : <GenericTable
            headerCells={inititalContainerHeadCells}
            order={'asc'}
            orderBy={'startPlanned'}
            rows={containerRows}
            handleSelectAllClick={() => {}}
            disableSelect
            noDataComponent={<NoData />}
            rowComponent={({ ...row }: InventoryRowProps) => (
              <InventoryRow
                {...row}
                headerCells={inititalContainerHeadCells}
                // handleRowClick={handleRowClick}
                // isSelected={isSelected(row.id)}
                // onDismissAlerts={handleDismissAlerts}
                // handleCreateMove={handleCreateMove}
                // equipmentsWithLeases={equipmentsWithLeases}
                noCollapse={true}
                facilityId={facilityId}
              />
            )}
          />
        }
      </Box>
    </Box>
  )
}

export default InventoryTable
