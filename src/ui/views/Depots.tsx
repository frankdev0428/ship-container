import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Box, CircularProgress, IconButton, Stack, useTheme } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useDispatch, useSelector } from 'react-redux'
import { DataGridPro, GridColDef, gridDetailPanelExpandedRowsContentCacheSelector, GridRenderCellParams, GridRowId, GridToolbarColumnsButton, GRID_CHECKBOX_SELECTION_COL_DEF, GRID_DETAIL_PANEL_TOGGLE_COL_DEF, useGridApiContext, useGridApiRef, useGridSelector } from '@mui/x-data-grid-pro'

import { AppState } from '../../store'
import { TableHeadCell } from '../../store/ui/types'
import LocationData from '../components/Locations/LocationCollapseData/LocationData'
import { listAddresses, listCountries, listFacilities, listDepotsStats } from '../../services/places/actions'
import GenericTable from '../components/shared/GenericTable/Table'
import FilterColumns from '../components/shared/GenericTable/FilterColumns'
import { genericHandleSelectAllClick, genericHandleRowClick } from '../components/shared/GenericTable/utils'
import FilterButton, { FilterChip, StateFilter } from '../components/shared/Filter/FilterButton'
import CollapsibleChips from '../components/shared/Filter/CollapsibleChips'
import Searchbar from '../components/shared/Search'
import NewDepot from '../components/Locations/NewDepot'
import { addDepotWithAddress } from '../../services/thunks'
import { getStorageRates } from '../../services/financials/actions'
import { facilityFilter, facilityOptions, filterFacilities, getFacilityOptions } from '../components/Locations/Filter/utils'
import { setDatagridState, setDepotFilters } from '../../store/ui/actions'
import DepotRow, { DepotRowDataProps, DepotRowProps, mapToDepotRow } from '../components/Locations/DepotRow'
import { ENABLE_DATAGRID } from '../globals'
import NewStorageRate from '../components/Locations/NewStorageRate'
import PatchDepot from '../components/Locations/PatchDepot'
import DeleteFacility from '../components/Locations/DeleteFacility'
import { CustomOverflowValue } from '../components/shared/CustomOverflowValue'
import { notEmpty, setDefaultsDataGridState } from '../components/shared/utils'

export const initialDepotHeadCells: TableHeadCell[] = [
  { id: 'name', isSortable: true, label: 'Name', hide: false },
  { id: 'city', isSortable: true, label: 'City', hide: false },
  { id: 'countryName', isSortable: true, label: 'Country', hide: false },
  { id: 'code', isSortable: true, label: 'Code', hide: true },
  { id: 'type', isSortable: true, label: 'Type', hide: true },
  { id: 'region', isSortable: true, label: 'Region', hide: true },
  // { id: 'containers', isSortable: true, label: 'Cont. in storage', hide: false },
  { id: 'containersAtDepot', isSortable: true, label: 'At depot', hide: false },
  { id: 'containersDeparting', isSortable: true, label: 'Departing', hide: false },
  { id: 'containersArriving', isSortable: true, label: 'Arriving', hide: false },
  { id: 'containersOverIdleLimit', isSortable: true, label: 'Over idle limit', hide: false },
  { id: 'containersBlocked', isSortable: true, label: 'Blocked', hide: false },
  // { id: 'daysidle', isSortable: true, label: 'Total days idle', hide: false },
  { id: 'storageRate', isSortable: true, label: 'Daily storage cost', hide: false },
  { id: 'actions', isSortable: false, align: 'center', label: <FilterColumns type='depot' size='small' />, width: 136 },
]

function DetailPanelContent({ row }: { row: DepotRowDataProps }) {
  const apiRef = useGridApiContext()

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
        <LocationData depotId={row.depotId} />
      </Stack>
    </Box>
  )
}

// function for customizing the master detail icon
function CustomDetailPanelToggle(props: Pick<GridRenderCellParams, 'id' | 'value'>) {
  const { id, value: isExpanded } = props
  const apiRef = useGridApiContext()
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

export const DepotsView: React.FunctionComponent<void> = () => {
  const [expanded, setExpanded] = useState<string[]>([])
  const [ticked, setTicked] = useState<string[]>([])

  const [rowData, setDepots] = useState<DepotRowDataProps[]>([])
  const [filteredDepots, setFilteredDepots] = useState<{ depots: DepotRowDataProps[], numOfFilters: number}>({ depots: [], numOfFilters: 0 })
  const [searchFilter, setSearchFilter] = useState('')
  const [uncollapseRows, setUncollapseRows] = useState<boolean | undefined>(undefined)

  const [chips, setChips] = useState<FilterChip[] | null>(null)

  const _dispatch = useDispatch()

  const datagridState = useSelector((state: AppState) => state.ui.datagridState)
  const apiRef = useGridApiRef()

  const handleClearSearch = () => {
    setSearchFilter('')
  }

  const { facilities, depotsStats, loadingStatus } = useSelector((state: AppState) => state.places)
  const { storage } = useSelector((state: AppState) => state.financials)
  const depotSortBy = useSelector((state: AppState) => state.ui.depotSortBy)
  const depotFilters = useSelector((state: AppState) => state.ui.depotFilters)
  const depotTableHeadCells = useSelector((state: AppState) => state.ui.depotTableHeadCells)
  const loadingAelerBoards = useSelector((state: AppState) => state.boards.loadingStatusAeler)
  const loadingKizyBoards = useSelector((state: AppState) => state.boards.loadingStatusKizy)
  const loadingNexxiotBoards = useSelector((state: AppState) => state.boards.loadingStatusNexxiot)
  const loadingEquipments = useSelector((state: AppState) => state.equipment.loadingStatus)
  const { shouldUseBackend } = useSelector((state: AppState) => state.settings)

  const setFilters = (filters: StateFilter[]) => _dispatch(setDepotFilters(filters))

  const theme = useTheme()

  useEffect(() => {
    _dispatch(listFacilities({}))
    _dispatch(listCountries())
    _dispatch(listAddresses())
    // _dispatch(listCities())
    _dispatch(getStorageRates({}))
    if (ENABLE_DATAGRID && datagridState?.facilities) {
      apiRef.current.restoreState(setDefaultsDataGridState(datagridState.facilities))
    }
  }, [])

  useEffect(() => {
    facilities.forEach(d => _dispatch(listDepotsStats(d.facilityId, shouldUseBackend)))
  }, [facilities, shouldUseBackend])

  useEffect(() => {
    if (facilities.length) {
      // setDepots(filterDepots(depots.map(l => mapToDepotRow(l)), searchFilter))
      setDepots(facilities.map(l => mapToDepotRow(l, depotsStats.find(d => d.depotId === l.facilityId), storage.find(d => d.depotId === l.facilityId))))
    }
  }, [facilities, depotsStats, storage, searchFilter])

  useEffect(() => {
    const containerFilters = depotFilters.map((f) => f?.containersAtDepot).filter(notEmpty)

    if (containerFilters.length > 0) {
      const containerIds = depotFilters.map((f) => f?.containersAtDepot?.value).filter(notEmpty)
      const id: string | undefined = filteredDepots.depots.find((d) => d.containersAtDepot?.find((d) => containerIds.find((c) => c === d)))?.id
      if (id !== undefined) setExpanded([id])
    }
  }, [JSON.stringify(depotFilters.map((f) => f?.containersAtDepot))])

  // const rowData = filterDepots(depots.map(l => mapToDepotRow(l, companies, depots)), searchFilter)

  // const handleSelectAllClick = genericHandleSelectAllClick(filteredDepots.depots, setExpanded)
  const handleSelectAllClick = genericHandleSelectAllClick(filteredDepots.depots, setTicked)

  const handleRowClick = genericHandleRowClick(expanded, setExpanded)
  const handleCheckboxClick = genericHandleRowClick(ticked, setTicked)

  const isExpanded = (id: string) => expanded.indexOf(id) !== -1
  const isTicked = (id: string) => ticked.indexOf(id) !== -1

  const handleFiltersChange = (depots: DepotRowDataProps[], chips: FilterChip[] | null) => {
    const numOfFilters = (searchFilter !== '' ? 1 : 0) + (chips ? chips.length : 0)
    setFilteredDepots({ depots: filterFacilities(depots, searchFilter), numOfFilters })
    setExpanded([])
    setTicked([])
    setChips(chips)
  }

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, facilities: columnState }))
  }

  const handleCreateDepot = (depot: any) => {
    // _dispatch(addLocation(location))
    _dispatch(addDepotWithAddress(depot))
    // FIXME
  }

  const columns = useMemo(() => [
    // Column for the Master Detail
    {
      ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
      headerName: 'Expand/Collapse',
      hideable: false,
      renderCell: (params: {row: DepotRowProps, id: string, value: any}) => (
        <CustomDetailPanelToggle id={params.id} value={params.value} />
      ),
      renderHeader: () => (
        <GridToolbarColumnsButton style={{ minWidth: 36 }} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
      ),
    },
    // Column for the Checkbox
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      headerName: 'Checkbox',
      hideable: false,
    },
    {
      field: 'name',
      headerName: 'Name',
      renderCell: (params: {row: DepotRowProps}) => {
        return <CustomOverflowValue dataKey={'facilities'} value={params.row.name}/>
      },
      flex: 1,
    },
    {
      field: 'city',
      headerName: 'City',
      renderCell: (params: {row: DepotRowProps}) => {
        return <CustomOverflowValue dataKey={'facilities'} value={params.row.city}/>
      },
      flex: 1,
    },
    {
      field: 'countryName',
      headerName: 'Country',
      renderCell: (params: {row: DepotRowProps}) => {
        return <CustomOverflowValue dataKey={'facilities'} value={params.row.countryName}/>
      },
      flex: 1,
    },
    {
      field: 'code',
      headerName: 'Code',
      renderCell: (params: {row: DepotRowProps}) => {
        return <CustomOverflowValue dataKey={'facilities'} value={params.row.code}/>
      },
      flex: 1,
    },
    {
      field: 'type',
      headerName: 'Type',
      renderCell: (params: {row: DepotRowProps}) => {
        return <CustomOverflowValue dataKey={'facilities'} value={params.row.type}/>
      },
      flex: 1,
    },
    {
      field: 'region',
      headerName: 'Region',
      renderCell: (params: {row: DepotRowProps}) => {
        return <CustomOverflowValue dataKey={'facilities'} value={params.row.region} />
      },
      flex: 1,
    },
    {
      field: 'containersAtDepot',
      headerName: 'At depot',
      renderCell: (params: {row: DepotRowProps}) => {
        return <CustomOverflowValue dataKey={'facilities'} value={params.row.containersAtDepot?.length}/>
      },
      flex: 1,
    },
    {
      field: 'containersDeparting',
      headerName: 'Departing',
      renderCell: (params: {row: DepotRowProps}) => {
        return <CustomOverflowValue dataKey={'facilities'} value={params.row.containersDeparting?.length} />
      },
      flex: 1,
    },
    {
      field: 'containersArriving',
      headerName: 'Arriving',
      renderCell: (params: {row: DepotRowProps}) => {
        return <CustomOverflowValue dataKey={'facilities'} value={params.row.containersArriving?.length}/>
      },
      flex: 1,
    },
    {
      field: 'containersOverIdleLimit',
      headerName: 'Over idle limit',
      renderCell: (params: {row: DepotRowProps}) => {
        const content = params.row.containersOverIdleLimit?.length
        return (
          <CustomOverflowValue
            dataKey={'facilities'}
            value={content}
            {...content && content > 0 && { typographyColor: theme.palette.error.main }}
          />
        )
      },
      flex: 1,
    },
    {
      field: 'containersBlocked',
      headerName: 'Blocked',
      renderCell: (params: {row: DepotRowProps}) => {
        return <CustomOverflowValue dataKey={'facilities'} value={params.row.containersBlocked?.length} />
      },
      flex: 1,
    },
    {
      field: 'storageRate',
      headerName: 'Daily storage cost',
      renderCell: (params: {row: DepotRowProps}) => {
        return <CustomOverflowValue dataKey={'facilities'} value={params.row.storageRate}/>
      },
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      filterable: false,
      sortable: false,
      hideable: false,
      minWidth: 122,
      renderCell: (params: {row: DepotRowProps}) => (
        <Box display='flex' alignItems={'center'} justifyContent={'space-between'} >
          <NewStorageRate depotId={params.row.facilityId}/>
          <PatchDepot depot={{
            facilityId: params.row.facilityId,
            name: params.row.name,
          }}/>
          <DeleteFacility facilityId={params.row.facilityId} name={params.row.name}/>
        </Box>
      ),
      flex: 1,
    },
  ] as GridColDef[],
  [])

  const getDetailPanelHeight = React.useCallback(() => 'auto' as const, [])
  const getDetailPanelContent = React.useCallback(({ row }) => <DetailPanelContent row={row} />, [])

  const depotActions = [
    { label: 'Uncollapse', action: () => setUncollapseRows(true), disabled: false },
    { label: 'Collapse', action: () => setUncollapseRows(false), disabled: false },
  ]

  return (
    <Box width='100%' id='depots-list' display='flex' flexDirection='column' >
      <Box mt={2} mb={1} display='flex' alignItems='center' flexWrap='wrap'>
        <Box flexGrow={1} display='flex' alignItems='center' flexWrap='wrap'>
          <Searchbar placeholder={'Search depots...'} filter={searchFilter} setFilter={setSearchFilter} clearAll={handleClearSearch} />
          {/* <EndDepot ml={2} depots={depots.filter(o => selected.includes(o.orderId))} onEndDepot={handleEndDepots}/> */}
          {
            (loadingStatus /* || loadingAelerBoards || loadingKizyBoards || loadingNexxiotBoards */ || loadingEquipments) &&
            <CircularProgress sx={{ marginLeft: '16px' }} size={20}/>
          }
        </Box>
        <NewDepot onCreate={handleCreateDepot} mr={2} />
        <FilterButton
          disabled={false}
          data={rowData}
          dataFilter={facilityFilter}
          options={facilityOptions}
          getOptions={getFacilityOptions}
          onFilter={handleFiltersChange}
          filters={depotFilters}
          setFilters={setFilters}
        />
      </Box>
      <Box mb={1}>
        <CollapsibleChips open={Boolean(chips?.length)} chips={chips} />
      </Box>
      <Box display='flex' flexDirection='column' overflow='hidden' height={'100%'}>
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
            // return setTicked(rowIds as string[])
            genericHandleRowClick(rowIds, setTicked)
          } }
          // Listener for when the column order, visibility or width changes
          onColumnOrderChange={ handleDispatch }
          onColumnVisibilityModelChange={ handleDispatch }
          onColumnWidthChange={ handleDispatch }
          onPinnedColumnsChange={ handleDispatch }
          onSortModelChange={ handleDispatch }
          columns={ columns }
          rows={ filteredDepots.depots }
          getRowId={ row => row.id }
          getDetailPanelContent={getDetailPanelContent}
          getDetailPanelHeight={getDetailPanelHeight}
          onDetailPanelExpandedRowIdsChange={(ids:GridRowId[]) => setExpanded(ids as string[])}
          detailPanelExpandedRowIds={expanded}
          sx={{
            '& .MuiDataGrid-detailPanel': {
              overflow: 'unset',
            },
          }}
        />
          : <GenericTable
            headerCells={depotTableHeadCells}
            order={depotSortBy.order}
            orderBy={depotSortBy.orderBy}
            // setSortBy={(sortBy: SortByUI) => _dispatch(setDepotSortBy(sortBy))}
            rows={filteredDepots.depots}
            selected={ticked}
            handleSelectAllClick={handleSelectAllClick}
            tableActions={depotActions}
            rowComponent={({ ...depot }: DepotRowProps) => (
              <DepotRow
                {...depot}
                key={depot.id}
                uncollapseRows={ticked.length > 0 ? uncollapseRows : undefined}
                isExpanded={isExpanded(depot.id)}
                isTicked={isTicked(depot.id)}
                handleRowClick={handleRowClick}
                handleCheckboxClick={handleCheckboxClick}
                setUncollapseRows={setUncollapseRows}
              />
            )}
          />
        }
      </Box>
    </Box >
  )
}

export default DepotsView
