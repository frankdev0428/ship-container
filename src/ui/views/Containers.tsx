import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, CircularProgress, IconButton, Stack, Tooltip } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { DataGridPro, GridColDef, gridDetailPanelExpandedRowsContentCacheSelector, GridRenderCellParams, GridToolbarColumnsButton, GRID_CHECKBOX_SELECTION_COL_DEF, GRID_DETAIL_PANEL_TOGGLE_COL_DEF, useGridApiContext, useGridApiRef, useGridSelector } from '@mui/x-data-grid-pro'
import WarningIcon from '@mui/icons-material/Warning'

import { AppState } from '../../store'
import { showError } from '../../store/error/actions'
import { SortByUI, TableHeadCell } from '../../store/ui/types'
import { setContainerFilters, setContainerSortBy, setDatagridState } from '../../store/ui/actions'
import { EquipmentStatusInput } from '../../services/equipment/types'
import { listEquipments, markAvailable } from '../../services/equipment/actions'
import { addDepotWithAddress, allocateContainers, listBoards, createEquipmentStatus } from '../../services/thunks'
import { listCompanies } from '../../services/customer/actions'
import { addLocation, listAddresses, listCountries, listFacilities, listLocations } from '../../services/places/actions'
import { createMove } from '../../services/move/actions'
import { EquipmentMoveInput } from '../../services/move/types'
import GenericTable from '../components/shared/GenericTable/Table'
import ContainerRow, { ContainerRowDataProps, ContainerRowProps, mapToContainerRow, useContainerStatusMap, showAvailableFrom, showAvailableTo } from '../components/Containers/ContainerRow'
import NewContainer from '../components/Containers/NewContainer'
import ChangeStatusButton from '../components/Containers/Status/ChangeStatus'
import AvailabilityButton from '../components/Containers/AvailabilityButton'
import { genericHandleSelectAllClick, genericHandleRowClick } from '../components/shared/GenericTable/utils'
import NewMove from '../components/Moves/NewMove'
import FilterButton, { FilterChip, StateFilter } from '../components/shared/Filter/FilterButton'
import { containerFilter, containerOptions, filterContainers, getContainerOptions } from '../components/Containers/Filter/utils'
import CollapsibleChips from '../components/shared/Filter/CollapsibleChips'
import Searchbar from '../components/shared/Search'
import { ExchangeLocationInput } from '../../services/places/types'
import { getStorageRates, getLeaseRates } from '../../services/financials/actions'
import Config from '../../config.json'
import { getTimeLabel, setDefaultsDataGridState } from '../components/shared/utils'
import FilterColumns from '../components/shared/GenericTable/FilterColumns'
import { ENABLE_DATAGRID } from '../globals'
import ContainerData from '../components/Containers/ContainerCollapsedData/ContainerData'
import theme from '../styles/coriolis-theme'
import { ColoredDot } from '../components/shared/ColoredDot'
import { DisableableTypography } from '../components/Utils/Typography'
import AlertButton from '../components/Containers/Alert/AlertButton'
import LatestMessageCell from '../components/Boards/LatestMessageCell'
import { CustomOverflowValue } from '../components/shared/CustomOverflowValue'

export const inititalContainerHeadCells: TableHeadCell[] = [
  { id: 'id', isSortable: true, label: 'Container Nº', hide: false, width: 180 },
  { id: 'createdAt', isSortable: true, label: 'Created at', hide: false },
  { id: 'operationalStatus', isSortable: true, label: 'Status', hide: false },
  { id: 'availableFrom', isSortable: true, label: 'Avail. from', hide: false },
  { id: 'availableTo', isSortable: true, label: 'Avail. until', hide: false },
  { id: 'idleDays', isSortable: true, label: 'Idle time', hide: false },
  { id: 'idleCost', isSortable: true, label: 'Idle cost', hide: false },
  { id: 'idleCostForecast', isSortable: true, label: 'Idle Cost Forecast', hide: true },
  { id: 'leaseRevenue', isSortable: true, label: 'Lease Revenue', hide: true },
  { id: 'leasesRevenueForecast', isSortable: true, label: 'Leases Revenue Forecast', hide: true },
  { id: 'daysOverdue', isSortable: true, label: 'Overdue time', hide: false },
  { id: 'customer', isSortable: true, label: 'Customer', hide: false },
  { id: 'orderId', isSortable: true, label: 'Order', hide: false },
  { id: 'currentLocation', isSortable: true, label: 'Location', hide: false },
  { id: 'destinationLocation', isSortable: true, label: 'Destination', hide: false },
  { id: 'containerVersion', isSortable: true, label: 'Version', hide: true },
  { id: 'containerCertificateDate', isSortable: true, label: 'Cert. Date', hide: true },
  { id: 'containerDoorType', isSortable: true, label: 'TIR locking plate', hide: true },
  { id: 'containerFloorType', isSortable: true, label: 'Floor insulation', hide: true },
  { id: 'alerts', isSortable: false, label: 'Alerts', hide: true },
  { id: 'boardLatestMessage', isSortable: false, label: 'Working board paired?', hide: true },
  { id: 'table-actions', isSortable: false, align: 'center', label: <FilterColumns type='container' size='small' />, width: 50 },
]

interface EquipmentWithLeases {
    equipmentId: string;
    leases: {
        value: string;
        label: string;
    }[];
}

function DetailPanelContent({ row, equipmentsWithLeases }: { row: ContainerRowDataProps, equipmentsWithLeases: EquipmentWithLeases[] }) {
  const apiRef = useGridApiContext()
  const _dispatch = useDispatch()

  const [width, setWidth] = React.useState(() => {
    if (apiRef.current.getRootDimensions) {
      const dimensions = apiRef.current.getRootDimensions()
      return dimensions ? dimensions.viewportInnerSize.width : undefined
    }
  })

  const handleViewportInnerSizeChange = useCallback(() => {
    if (apiRef.current.getRootDimensions) {
      const dimensions = apiRef.current.getRootDimensions()
      dimensions && setWidth(dimensions.viewportInnerSize.width)
    }
  }, [apiRef])

  useEffect(() => {
    return apiRef.current.subscribeEvent(
      'viewportInnerSizeChange',
      handleViewportInnerSizeChange,
    )
  }, [apiRef, handleViewportInnerSizeChange])

  const handleCreateMove = (move: EquipmentMoveInput) => {
    _dispatch(createMove(move.equipmentId, move))
    // FIXME
  }

  return (

    <Box
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: '#f9f9fb',
      }}
    >
      <Stack
        sx={{
          px: 2,
          height: '100%',
          boxSizing: 'border-box',
          position: 'sticky',
          left: 0,
          width: width || '100%',
          minWidth: 860,
          backgroundColor: '#f9f9fb',
        }}
        direction="column"
      >
      <ContainerData
        equipmentId={ row.equipmentId || '' }
        containerId={ row.id }
        leases={ row.leases }
        handleCreateMove={ handleCreateMove }
        equipmentsWithLeases={ equipmentsWithLeases }
      />
      </Stack>
    </Box>
  )
}

export const ContainersView: React.FunctionComponent<void> = () => {
  const apiRef = useGridApiRef()
  const loadingStatus = useSelector((state: AppState) => state.equipment.loadingStatus)
  const equipments = useSelector((state: AppState) => state.equipment.equipments)
  const { companies } = useSelector((state: AppState) => state.company)
  const { facilities } = useSelector((state: AppState) => state.places)
  const { boards, loadingStatusAeler, loadingStatusKizy, loadingStatusNexxiot } = useSelector((state: AppState) => state.boards)
  const boardsPaired = boards.filter((b) => b.containerIds && b.containerIds?.length > 0)

  const { storage, lease } = useSelector((state: AppState) => state.financials)
  // const { moves } = useSelector((state: AppState) => state.moves)

  const { containerTableHeadCells, containerSortBy, containerFilters } = useSelector((state: AppState) => state.ui)
  const setFilters = (filters: StateFilter[]) => _dispatch(setContainerFilters(filters))

  const loadingBoards = loadingStatusAeler || loadingStatusKizy || loadingStatusNexxiot
  const isLoading = loadingStatus || loadingBoards // loadingStatus || loadingOrders

  const [selected, setSelected] = useState<string[]>([])
  const [availabilityChip, setAvailabilityChip] = useState({ label: '', show: false })

  const [rowData, setContainers] = useState<ContainerRowDataProps[]>([])
  const [filteredContainers, setFilteredContainers] = useState<{ containers: ContainerRowDataProps[], numOfFilters: number}>({ containers: [], numOfFilters: 0 })
  const [searchFilter, setSearchFilter] = useState('')
  const [chips, setChips] = useState<FilterChip[] | null>(null)
  // const [pageSize, setPageSize] = useState(25)

  const { shouldUseBackend } = useSelector((state: AppState) => state.settings)

  const _dispatch = useDispatch()

  const datagridState = useSelector((state: AppState) => state.ui.datagridState)

  // function for customizing the master detail icon
  function CustomDetailPanelToggle(props: Pick<GridRenderCellParams, 'id' | 'value'>) {
    const { id, value: isExpanded } = props
    // To avoid calling ´getDetailPanelContent` all the time, the following selector
    // gives an object with the detail panel content for each row id.
    const contentCache = useGridSelector(
      apiRef,
      gridDetailPanelExpandedRowsContentCacheSelector,
    )

    return (
      <IconButton size='small' color='primary'>
        { isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    )
  }

  const columns = useMemo(() => {
    const columns = [
    // Column for the Master Detail
      {
        ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
        field: '__detail_panel_toggle__',
        headerName: 'Expand/Collapse',
        hideable: false,
        renderCell: (params: {row: ContainerRowProps, id: string, value: any}) => (
        <CustomDetailPanelToggle id={params.id} value={params.value} />
        ),
        renderHeader: () => (
        <GridToolbarColumnsButton style={{ minWidth: 36 }} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
        ),
      },
      // Column for the Checkbox
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        field: '__check__',
        headerName: 'Checkbox',
        hideable: false,
      },
      {
        field: 'id',
        headerName: 'Container Nº',
        minWidth: 180,
        renderCell: (params: { row: ContainerRowProps }) => (
          params.row.isNewlyInserted === true
            ? <>
                <span style={{
                  background: theme.palette.primary.highlight,
                  color: 'white',
                  borderRadius: 5,
                  padding: 3,
                  fontSize: 10,
                  marginRight: 3,
                  position: 'absolute',
                  marginTop: -36,
                  marginLeft: -8,
                  zIndex: 100,
                }}>
                  New
                </span>
                <CustomOverflowValue dataKey={'containers'} value={params.row.id}/>
              </>
            : (
              <React.Fragment>
              <CustomOverflowValue dataKey={'containers'} value={params.row.id}/>
              {params.row.isWarning
                ? <Tooltip style={{ marginLeft: 10 }} title={'Problem in timeline'}>
                    <WarningIcon color='error'/>
                  </Tooltip>
                : ''}
              </React.Fragment>
              )
          // : <Box display='flex' alignItems='center'>
          //   </Box>
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Created at',
        renderCell: (params: { row: ContainerRowProps }) =>
          <CustomOverflowValue
            dataKey={'containers'}
            value={params.row.createdAt ? getTimeLabel(params.row.createdAt, 'dateHourWithTz') : undefined }
          />,
      },
      {
        field: 'operationalStatus',
        headerName: 'Status',
        renderCell: (params: { row: ContainerRowProps }) => {
          const statusMap = useContainerStatusMap()
          return (
            <Box display='flex' alignItems='center' overflow='hidden'>
              <ColoredDot color={statusMap.get(params.row.status)?.color} />
              <CustomOverflowValue dataKey={'containers'} value={statusMap.get(params.row.status)?.label}/>
            </Box>
          )
        },
      },
      {
        field: 'availableFrom',
        headerName: 'Avail. from',
        renderCell: (params: { row: ContainerRowProps }) => {
          return showAvailableFrom(params.row.availableFrom)
        // getTimeLabel(params.row.availableFrom)
        },
      },
      {
        field: 'availableTo',
        headerName: 'Avail. until',
        renderCell: (params: { row: ContainerRowProps }) => {
          return showAvailableTo(params.row.availableFrom, params.row.availableTo)
        // return params.row.availableTo !== undefined
        //   ? getTimeLabel(params.row.availableTo)
        //   : 'N/A'
        },
      },
      {
        field: 'idleDays',
        headerName: 'Idle time',
        renderCell: (params: { row: ContainerRowProps }) => {
          return <CustomOverflowValue dataKey={'containers'} value={params.row.idleDays}/>
        },
      },
      {
        field: 'idleCost',
        headerName: 'Idle cost',
        renderCell: (params: { row: ContainerRowProps }) => {
          return <CustomOverflowValue dataKey={'containers'} value={params.row.idleCost}/>
        },
      },
      {
        field: 'idleCostForecast',
        headerName: 'Idle cost Forecast',
        renderCell: (params: { row: ContainerRowProps }) => {
          return <CustomOverflowValue dataKey={'containers'} value={params.row.idleCostForecast}/>
        },
      },
      {
        field: 'leaseRevenue',
        headerName: 'Lease Revenue',
        renderCell: (params: { row: ContainerRowProps }) => {
          return <CustomOverflowValue dataKey={'containers'} value={params.row.leaseRevenue}/>
        },
      },
      {
        field: 'leasesRevenueForecast',
        headerName: 'Lease Revenue Forecast',
        renderCell: (params: { row: ContainerRowProps }) => {
          return <CustomOverflowValue dataKey={'containers'} value={params.row.leasesRevenueForecast}/>
        },
      },
      {
        field: 'daysOverdue',
        headerName: 'Overdue time',
        renderCell: (params: { row: ContainerRowProps }) => {
          const dod = params.row.daysOverdue
          const isWarning = dod && dod > 0
          return (
          <Box display='flex' alignItems='left'>
            <DisableableTypography noWrap variant='body2'>{dod}</DisableableTypography>
            {isWarning
              ? <Tooltip style={{ marginLeft: 10 }} title={'Container is overdue'}>
                  <WarningIcon color='error'/>
                </Tooltip>
              : ''}
          </Box>
          )
        },
      },
      {
        field: 'customer',
        headerName: 'Customer',
        renderCell: (params: { row: ContainerRowProps }) => {
          return <CustomOverflowValue dataKey={'containers'} value={params.row.customer}/>
        },
      },
      {
        field: 'orderId',
        headerName: 'Order',
        renderCell: (params: { row: ContainerRowProps }) => {
          return (
            <CustomOverflowValue
              dataKey={'containers'}
              value={params.row.orderId}
              { ...params.row.status !== 'ALLOCATED' && { typographyColor: 'gray' }}
            />
          )
        },
      },
      {
        field: 'currentLocation',
        headerName: 'Location',
        renderCell: (params: { row: ContainerRowProps }) => {
          return <CustomOverflowValue dataKey={'containers'} value={params.row.currentLocation}/>
        },
      },
      {
        field: 'destinationLocation',
        headerName: 'Destination',
        renderCell: (params: { row: ContainerRowProps }) => {
          return <CustomOverflowValue dataKey={'containers'} value={params.row.destinationLocation}/>
        },
      },
      {
        field: 'containerVersion',
        headerName: 'Version',
        renderCell: (params: { row: ContainerRowProps }) =>
          <CustomOverflowValue dataKey={'containers'} value={params.row.containerVersion}/>,
      },
      {
        field: 'containerCertificateDate',
        headerName: 'Cert. Date',
        renderCell: (params: { row: ContainerRowProps }) =>
          <CustomOverflowValue
            dataKey={'containers'}
            value= {params.row.containerCertificateDate ? getTimeLabel(params.row.containerCertificateDate, 'dateHourWithTz') : undefined}
          />,
      },
      {
        field: 'containerDoorType',
        headerName: 'TIR locking plate',
        renderCell: (params: { row: ContainerRowProps }) =>
          <CustomOverflowValue dataKey={'containers'} value={params.row.containerDoorType}/>,
      },
      {
        field: 'containerFloorType',
        headerName: 'Floor insulation',
        renderCell: (params: { row: ContainerRowProps }) =>
          <CustomOverflowValue dataKey={'containers'} value={params.row.containerFloorType} />,
      },
      {
        field: 'alerts',
        headerName: 'Alerts',
        renderCell: (params: { row: ContainerRowProps }) =>
          params.row.alerts?.length
            ? <AlertButton alerts={params.row.alerts} onDismiss={handleDismissAlerts} />
            : <DisableableTypography noWrap variant='body2' />,
      },
      {
        field: 'boardLatestMessage',
        headerName: 'Working board paired?',
        renderCell: (params: { row: ContainerRowProps }) =>
          <LatestMessageCell
            latestMessage={boardsPaired.find((b) => b.provider === 'aeler' && b.containerIds && params.row.id && b.containerIds.includes(params.row.id))?.latestMessage}
            isBoardPaired={!!boardsPaired.find((b) => b.containerIds && b.containerIds.includes(params.row.id))}
          />,
      },
    ] as GridColDef[]

    if (ENABLE_DATAGRID && datagridState?.containers && apiRef?.current?.exportState) {
      const columnState = apiRef.current.exportState()
      if (columnState?.columns?.orderedFields) {
        const indexedColumns = columns.reduce((indexed, column) => {
          return {
            ...indexed,
            ...column.field && { [column.field]: column },
          }
        }, {} as { [x: string]: GridColDef })

        return columnState.columns.orderedFields.map(fieldName => indexedColumns[fieldName])
      }
    }

    return columns
  },
  [JSON.stringify(boardsPaired)])

  useEffect(() => {
    // _dispatch(listEquipments({
    //   // availableAfter: (new Date()).toISOString(),
    // }, shouldUseBackend))
    // _dispatch(listAvailableEquipments({
    //   // status: ['AVAILABLE'],
    // }))
    _dispatch(listCompanies({}))
    _dispatch(listFacilities({}))
    _dispatch(listLocations())
    _dispatch(listCountries())
    _dispatch(listAddresses())
    // _dispatch(listCities())
    _dispatch(getStorageRates({}))
    _dispatch(getLeaseRates({}))
    _dispatch(listBoards()) // we need that for the board picker
    if (ENABLE_DATAGRID && datagridState?.containers) {
      apiRef.current.restoreState(setDefaultsDataGridState(datagridState.containers))
    }
  }, [])

  useEffect(() => {
    _dispatch(listEquipments({
      // availableAfter: (new Date()).toISOString(),
    }, shouldUseBackend))
  }, [shouldUseBackend])

  const containers_ = equipments.map(c => {
    return ({
      ...c,
      customer: c.currentLease?.customerId,
      orderContent: {
        orderId: c.currentLease?.orderId,
        contractualStatus: c.currentLease?.contractStatus,
      },
      // ...containerAlerts.length && { alerts: containerAlerts },
    })
  })

  useEffect(() => {
    if (equipments.length) {
      const containers = equipments.map(c => {
        // const order = orders.find(o => o.id === c.orderId)
        // const containerAlerts = alerts.filter(a => a.entityId === c.id)

        return ({
          ...c,
          customer: c.currentLease?.customerId,
          orderContent: {
            orderId: c.currentLease?.orderId,
            contractualStatus: c.currentLease?.contractStatus,
          },
          // ...containerAlerts.length && { alerts: containerAlerts },
        })
      })

      setContainers(filterContainers(containers.map(c => mapToContainerRow(c, companies, facilities, storage, lease, shouldUseBackend)), searchFilter))
    } else {
      setContainers([])
    }
  }, [equipments, companies, facilities, searchFilter, shouldUseBackend])

  const handleCheckAvailability = (dateFrom: Date | null, dateTo: Date | null, depotIds: string[]) => {
    if (!dateFrom /* || depotIds.length === 0 */) {
      _dispatch(showError(['Date and Facility ID are required.']))
      return
    }

    const depotNames = depotIds ? depotIds.map(did => facilities.find(d => d.facilityId === did)?.name || did) : undefined

    dateFrom && dateTo && setAvailabilityChip({
      label: depotNames && depotNames.length > 0
        ? `Available: from ${getTimeLabel(dateFrom)} to ${getTimeLabel(dateTo)} in ${depotNames.join(', ')}`
        : `Available: from ${getTimeLabel(dateFrom)} to ${getTimeLabel(dateTo)}`,
      show: true,
    })

    // setChips([...chips || [], {
    //   type: 'availability',
    //   label: depotNames && depotNames.length > 0
    //     ? `Available: from ${moment(dateFrom).format('DD-MM-YYYY')} to ${moment(dateTo).format('DD-MM-YYYY')} in ${depotNames.join(', ')}`
    //     : `Available: from ${moment(dateFrom).format('DD-MM-YYYY')} to ${moment(dateTo).format('DD-MM-YYYY')}`,
    //   onRemove: () => {
    //     setAvailabilityChip(null)
    //     _dispatch(listEquipments({}))
    //   },
    // }])

    dateFrom && _dispatch(
      listEquipments({
        statusFrom: dateFrom.toISOString(),
        statusTo: (dateTo || dateFrom).toISOString(),
        status: ['AVAILABLE'],
        startStatusAtLocationId: depotIds.length > 0 ? depotIds : undefined, // FIXME
        // depotIds: depotIds, // FIXME
        // status: ['AVAILABLE', 'ALLOCATED'],
      }, shouldUseBackend),
    )
    // dateFrom && _dispatch(listAvailableEquipments({
    //   statusFrom: dateFrom.toISOString(),
    //   statusTo: (dateTo || dateFrom).toISOString(),
    //   status: ['AVAILABLE'],
    //   startStatusAtLocationId: depotIds && depotIds.length > 0 ? depotIds[0] : undefined, // FIXME
    //   // depotIds, // FIXME
    //   // status: ['AVAILABLE', 'ALLOCATED'],
    // }))
  }

  const handleSelectAllClick = genericHandleSelectAllClick(filteredContainers.containers, setSelected)
  const handleRowClick = genericHandleRowClick(selected, setSelected)

  const handleAllocate = (orderId: string) => {
    const equipmentIds = selected.map(containerId =>
      equipments.find(eq => eq.aelerContainerId === containerId)?.equipmentId).filter(Boolean) as string[]
    _dispatch(allocateContainers(equipmentIds, { orderId }))

    setSelected([])
  }

  const handleChangeStatus = (input: EquipmentStatusInput) => {
    if ((input.body?.status as any) === 'AVAILABLE') {
      _dispatch(markAvailable(input.equipmentId, input.body?.depotInDateActual || new Date(), input.body?.locationFrom))
    } else {
      _dispatch(createEquipmentStatus(input))
    }
    setSelected([])
  }

  const handleCreateMove = (move: EquipmentMoveInput) => {
    _dispatch(createMove(move.equipmentId, move))
    // FIXME
  }

  const handleCreateLocation = (location: ExchangeLocationInput) => {
    _dispatch(addLocation(location))
    // FIXME
  }

  const handleCreateDepot = (depot: any) => {
    // _dispatch(addLocation(location))
    _dispatch(addDepotWithAddress(depot))
    // FIXME
  }

  const handleDismissAlerts = (/* alerts: Alert[] */) => {
    // _dispatch(dismissAlerts({ ids: alerts.map(a => a.alertId) }))
  }

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, containers: columnState }))
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const eqOptions = equipments.map(e => ({
    value: e.equipmentId,
    label: e.aelerContainerId || e.equipmentId,
  }))

  const equipmentsWithLeases = equipments.map(e => ({
    equipmentId: e.equipmentId,
    leases: [...(e.currentLease
      ? [{
          value: e.currentLease?.contractId,
          label: e.currentLease?.orderId,
        }]
      : [])],
  }))

  const handleFiltersChange = (containers: ContainerRowDataProps[], chips: FilterChip[] | null) => {
    const numOfFilters = (searchFilter !== '' ? 1 : 0) + (chips ? chips.length : 0)
    setFilteredContainers({ containers: filterContainers(containers, searchFilter), numOfFilters })
    setChips(chips)
    setSelected([])
  }

  const getDetailPanelHeight = React.useCallback(() => 'auto' as const, [])
  const getDetailPanelContent = React.useCallback(({ row }) => <DetailPanelContent row={row} equipmentsWithLeases={equipmentsWithLeases} />, [JSON.stringify(equipmentsWithLeases)])

  const chips_ = [
    ...(chips || []),
    ...(availabilityChip.show
      ? [{
          label: availabilityChip?.label,
          onRemove: () => {
            setAvailabilityChip({ ...availabilityChip, show: false })
            _dispatch(listEquipments({}, shouldUseBackend))
          },
        }]
      : []),
  ]

  const hasMovesFF = Config.FF_ENABLE_MOVES !== undefined && Config.FF_ENABLE_MOVES === 'true'

  return (
    <Box width='100%' id='containers-list' display='flex' flexDirection='column' >
      <Box mt={2} mb={1} display='flex' alignItems='center' flexWrap={'wrap'}>
        <Box flexGrow={1} display='flex' alignItems='center' flexWrap={'wrap'}>
          <Box>
            <Searchbar
              placeholder={'Search containers...'}
              filter={searchFilter}
              setFilter={setSearchFilter}
              clearAll={() => setSearchFilter('')}
            />
          </Box>
          <ChangeStatusButton ml={2}
            container={containers_.find(r => selected.includes(r?.aelerContainerId || 'undefined'))}
            disabled={
              selected.length !== 1 ||
              (
                selected.length === 1 &&
                  (
                    // (containers_.find(c => c.aelerContainerId === selected[0])?.currentStatus?.validToActual as any) !== undefined ||
                    (containers_.find(c => c.aelerContainerId === selected[0])?.currentStatus?.status as any) === 'ALLOCATED'
                  )
              )
            }
            onChangeStatus={handleChangeStatus}
          />
          { (isLoading) && <CircularProgress sx={{ marginLeft: '16px' }} size={20}/> }
        </Box>
        <AvailabilityButton onClick={handleCheckAvailability}/>
        <NewContainer ml={2} mr={2} />
        {hasMovesFF && <NewMove mr={1} equipments={eqOptions} equipmentsWithLeases={equipmentsWithLeases} onCreate={handleCreateMove} />}
        {/* <NewLocation onCreate={handleCreateLocation} /> */}
        {/* <NewDepot onCreate={handleCreateDepot} /> */}
        <FilterButton
          disabled={false}
          data={rowData}
          dataFilter={containerFilter}
          options={containerOptions}
          getOptions={getContainerOptions}
          onFilter={handleFiltersChange}
          filters={containerFilters}
          setFilters={setFilters}
        />
      </Box>
      <Box mb={1}>
        <CollapsibleChips open={Boolean(chips_.length)} chips={chips_} />
      </Box>
      <Box display='flex' flexDirection='column' overflow='hidden' height={'100%'} >
       { ENABLE_DATAGRID
         ? <DataGridPro
          apiRef={ apiRef }
          // till MUI v6, column visibility model must be initialized for onColumnVisibilityModelChange to work
          initialState={{ columns: { columnVisibilityModel: {} } }}
          // set text on the hideColumns button
          localeText={{ toolbarColumns: '' }}
          checkboxSelection
          // disableColumnFilter
          disableSelectionOnClick
          // Listener for when a row is selected (rowIds = the Ids of all rows selected)
          onSelectionModelChange={(rowIds) => {
            setSelected(rowIds as string[])
          } }
          // Listener for when the column order, visibility or width changes
          onColumnOrderChange={ handleDispatch }
          onColumnVisibilityModelChange={ handleDispatch }
          onColumnWidthChange={ handleDispatch }
          onPinnedColumnsChange={ handleDispatch }
          onSortModelChange={ handleDispatch }
          columns={ columns }
          rows={ filteredContainers.containers }
          getRowId={ row => row.id }
          getDetailPanelContent={getDetailPanelContent}
          getDetailPanelHeight={getDetailPanelHeight}
          sx={{
            '& .MuiDataGrid-detailPanel': {
              overflow: 'unset',
            },
          }}
        />
         : <GenericTable
          headerCells={containerTableHeadCells}
          order={containerSortBy.order}
          orderBy={containerSortBy.orderBy}
          setSortBy={(sortBy: SortByUI) => _dispatch(setContainerSortBy(sortBy))}
          rows={filteredContainers.containers}
          selected={selected}
          handleSelectAllClick={handleSelectAllClick}
          rowComponent={({ ...row }: ContainerRowProps) => (
            <ContainerRow
              {...row}
              handleRowClick={handleRowClick}
              isSelected={isSelected(row.id)}
              onDismissAlerts={handleDismissAlerts}
              handleCreateMove={handleCreateMove}
              equipmentsWithLeases={equipmentsWithLeases}
              isBoardPaired={!!boardsPaired.find((b) => b.containerIds && b.containerIds.includes(row.id))}
              boardLatestMessage={boardsPaired.find((b) => b.provider === 'aeler' && b.containerIds && row.id && b.containerIds.includes(row.id))?.latestMessage}
            />
          )}
        />
        }
      </Box>
    </Box >
  )
}

export default ContainersView
