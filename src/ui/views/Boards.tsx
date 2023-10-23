import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { DataGridPro, GridColDef, GridToolbarColumnsButton, useGridApiRef } from '@mui/x-data-grid-pro'
import { format } from 'date-fns'

import { AppState } from '../../store'
import { SortByUI, TableHeadCell } from '../../store/ui/types'
import GenericTable from '../components/shared/GenericTable/Table'
import { genericHandleSelectAllClick, genericHandleRowClick } from '../components/shared/GenericTable/utils'
import FilterButton, { FilterChip, StateFilter } from '../components/shared/Filter/FilterButton'
import CollapsibleChips from '../components/shared/Filter/CollapsibleChips'
import Searchbar from '../components/shared/Search'
import BoardRow, { BoardRowDataProps, BoardRowProps, mapToBoardRow } from '../components/Boards/BoardRow'
import NewBoard from '../components/Boards/NewBoard'
import { listBoards, createBoard } from '../../services/thunks'
import { Board } from '../../services/boards/types'
import FilterColumns from '../components/shared/GenericTable/FilterColumns'
import { setBoardFilters, setBoardSortBy, setDatagridState } from '../../store/ui/actions'
import { boardFilter, filterBoards, getBoardOptions, boardOptions } from '../components/Boards/Filter/utils'
import { ENABLE_DATAGRID } from '../globals'
import SensorsCell from '../components/Boards/SensorsCell'
import BatteryCell from '../components/Boards/BatteryCell'
import DeleteBoard from '../components/Boards/DeleteBoard'
import LatestMessageCell from '../components/Boards/LatestMessageCell'
import { CustomOverflowValue } from '../components/shared/CustomOverflowValue'
import { setDefaultsDataGridState } from '../components/shared/utils'

export const inititalBoardHeadCells: TableHeadCell[] = [
  { id: 'id', isSortable: true, label: 'Board nº', hide: false, width: 200 },
  { id: 'provider', isSortable: true, label: 'Provider', hide: false },
  { id: 'containerIds', isSortable: true, label: 'Container Nºs', hide: false, width: 150 },
  // { id: 'ctUpdated', isSortable: true, label: 'CT updated', hide: false },
  { id: 'hasGps', isSortable: false, label: 'GPS', hide: false },
  { id: 'hasShock', isSortable: false, label: 'Shock', hide: false },
  { id: 'hasTempExt', isSortable: false, label: 'Ext. Temperature', hide: false },
  { id: 'hasTempInt', isSortable: false, label: 'Int. Temperature', hide: false },
  { id: 'hasPressureExt', isSortable: false, label: 'Ext. Pressure', hide: true },
  { id: 'hasPressureInt', isSortable: false, label: 'Int. Pressure', hide: false },
  { id: 'hasHumExt', isSortable: false, label: 'Ext. Humidity', hide: true },
  { id: 'hasHumInt', isSortable: false, label: 'Int. Humidity', hide: false },
  { id: 'hasGases', isSortable: false, label: 'VOC', hide: true },
  { id: 'hasLightInt', isSortable: false, label: 'Int. Light', hide: true },
  { id: 'hasLightExt', isSortable: false, label: 'Ext. Light', hide: true },
  { id: 'hasDoor', isSortable: false, label: 'Door', hide: false },
  { id: 'hasRFID', isSortable: false, label: 'RFID', hide: true },
  { id: 'battery', isSortable: false, label: 'Battery', hide: false },
  { id: 'latestMessage', isSortable: false, label: 'Latest message', hide: false },
  { id: 'actions', isSortable: false, align: 'center', label: '', width: 80 },
]

export const BoardsView: React.FunctionComponent<void> = () => {
  const [selected, setSelected] = useState<string[]>([])
  const [rowData, setBoards] = useState<BoardRowDataProps[]>([])
  const [filteredBoards, setFilteredBoards] = useState<{ boards: BoardRowDataProps[], numOfFilters: number}>({ boards: [], numOfFilters: 0 })
  const [searchFilter, setSearchFilter] = useState('')
  const [chips, setChips] = useState<FilterChip[] | null>(null)

  const handleClearSearch = () => {
    setSearchFilter('')
  }

  const { boards, loadingStatusAeler, loadingStatusContainerId, loadingStatusKizy, loadingStatusNexxiot } = useSelector((state: AppState) => state.boards)

  const boardTableHeadCells = useSelector((state: AppState) => state.ui.boardTableHeadCells)
  const boardSortBy = useSelector((state: AppState) => state.ui.boardSortBy)
  const boardFilters = useSelector((state: AppState) => state.ui.boardFilters)

  const setFilters = (filters: StateFilter[]) => _dispatch(setBoardFilters(filters))

  const _dispatch = useDispatch()

  const apiRef = useGridApiRef()
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)

  useEffect(() => {
    _dispatch(listBoards())
    if (ENABLE_DATAGRID && datagridState?.boards) {
      apiRef.current.restoreState(setDefaultsDataGridState(datagridState.boards))
    }
  }, [])

  useEffect(() => {
    if (boards.length) {
      setBoards(filterBoards(boards.map(b => mapToBoardRow(b)), searchFilter))
      // setBoards(boards.map(b => mapToBoardRow(b)))
    } else {
      setBoards([])
    }
  }, [boards, searchFilter])

  const columns = useMemo(() => [
    {
      field: 'actions',
      headerName: 'Actions',
      hideable: false,
      filterable: false,
      sortable: false,
      minWidth: 70,
      renderHeader: () => (
        <GridToolbarColumnsButton style={{ minWidth: 36 }} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
      ),
      renderCell: (params: {row: BoardRowProps}) => (
        params.row.provider === 'aeler' && <DeleteBoard boardId={params.row.id}/>
      ),
    },
    {
      field: 'id',
      headerName: 'Board nº',
      renderCell: (params: {row: BoardRowProps}) => (
          <CustomOverflowValue dataKey={'boards'} value={params.row.id} />
      ),
    },
    {
      field: 'provider',
      headerName: 'Provider',
      renderCell: (params: {row: BoardRowProps}) => (
        <CustomOverflowValue dataKey={'boards'} value={params.row.provider} />
      ),
    },
    {
      field: 'containerIds',
      headerName: 'Container Nºs',
      renderCell: (params: {row: BoardRowProps}) => (
        <CustomOverflowValue dataKey={'boards'} value={params.row.containerIds.join(', ')} />
      ),
    },
    {
      field: 'hasGps',
      headerName: 'GPS',
      renderCell: (params: {row: BoardRowProps, field: any}) => (
        <SensorsCell
          sensorName={params.field}
          enabled={params.row.hasGps}
          value={
            params.row.healthGps?.updatedAt && format(new Date(params.row.healthGps?.updatedAt).getTime(), 'dd-MM-yyyy HH:mm z')}
          lastUpdatedAt={params.row.healthGps?.updatedAt}
          formatValue={(value) => `${value}`}
        />
      ),
    },
    {
      field: 'hasShock',
      headerName: 'Shock',
      renderCell: (params: {row: BoardRowProps, field: any}) => (
        <SensorsCell
          sensorName={params.field}
          enabled={params.row.hasShock}
          value={params.row.healthSensors ? 'X' : undefined}
          lastUpdatedAt={params.row.healthSensors?.updatedAt}
          formatValue={(value) => `${value}`}
        />
      ),
    },
    {
      field: 'hasTempExt',
      headerName: 'Ext. Temperature',
      renderCell: (params: {row: BoardRowProps, field: any}) => (
        <SensorsCell
          sensorName={params.field}
          enabled={params.row.hasTempExt}
          value={params.row.healthSensors ? params.row.healthSensors.externalTemperature : undefined}
          lastUpdatedAt={params.row.healthSensors?.updatedAt}
          formatValue={(value) => `${value}`}
        />
      ),
    },
    {
      field: 'hasTempInt',
      headerName: 'Int. Temperature',
      renderCell: (params: {row: BoardRowProps, field: any}) => (
        <SensorsCell
          sensorName={params.field}
          enabled={params.row.hasTempInt}
          value={params.row.healthSensors ? (params.row.healthSensors as any).temperature : undefined}
          lastUpdatedAt={params.row.healthSensors?.updatedAt}
          formatValue={(value) => `${value}`}
        />
      ),
    },
    {
      field: 'hasPressureExt',
      headerName: 'Ext. Pressure',
      renderCell: (params: {row: BoardRowProps, field: any}) => (
        <SensorsCell
          sensorName={params.field}
          enabled={params.row.hasPressureExt}
          value={params.row.healthSensors ? (params.row.healthSensors as any).externalPressure : undefined}
          lastUpdatedAt={params.row.healthSensors?.updatedAt}
          formatValue={(value) => `${value}`}
        />
      ),
    },
    {
      field: 'hasPressureInt',
      headerName: 'Int. Pressure',
      renderCell: (params: {row: BoardRowProps, field: any}) => (
        <SensorsCell
          sensorName={params.field}
          enabled={params.row.hasPressureInt}
          value={params.row.healthSensors ? (params.row.healthSensors as any).pressure : undefined}
          lastUpdatedAt={params.row.healthSensors?.updatedAt}
          formatValue={(value) => `${value}`}
        />
      ),
    },
    {
      field: 'hasHumExt',
      headerName: 'Ext. Humidity',
      renderCell: (params: {row: BoardRowProps, field: any}) => (
        <SensorsCell
          sensorName={params.field}
          enabled={params.row.hasHumExt}
          value={params.row.healthSensors ? (params.row.healthSensors as any).externalHumidity : undefined}
          lastUpdatedAt={params.row.healthSensors?.updatedAt}
          formatValue={(value) => `${value}`}
        />
      ),
    },
    {
      field: 'hasHumInt',
      headerName: 'Int. Humidity',
      renderCell: (params: {row: BoardRowProps, field: any}) => (
        <SensorsCell
          sensorName={params.field}
          enabled={params.row.hasHumInt}
          value={params.row.healthSensors ? (params.row.healthSensors as any).humidity : undefined}
          lastUpdatedAt={params.row.healthSensors?.updatedAt}
          formatValue={(value) => `${value}`}
        />
      ),
    },
    {
      field: 'hasGases',
      headerName: 'VOC',
      renderCell: (params: {row: BoardRowProps, field: any}) => (
        <SensorsCell
          sensorName={params.field}
          enabled={params.row.hasGases}
          value={params.row.healthSensors ? (params.row.healthSensors as any).ngm3TVOC : undefined}
          lastUpdatedAt={params.row.healthSensors?.updatedAt}
          formatValue={(value) => `${value}`}
        />
      ),
    },
    {
      field: 'hasLightInt',
      headerName: 'Int. Light',
      renderCell: (params: {row: BoardRowProps, field: any}) => (
        <SensorsCell
          sensorName={params.field}
          enabled={params.row.hasGases}
          value={params.row.healthSensors ? (params.row.healthSensors as any).centiLux : undefined}
          lastUpdatedAt={params.row.healthSensors?.updatedAt}
          formatValue={(value) => `${value}`}
        />
      ),
    },
    {
      field: 'hasLightExt',
      headerName: 'Ext. Light',
      renderCell: (params: {row: BoardRowProps, field: any}) => (
        <SensorsCell
          sensorName={params.field}
          enabled={params.row.hasGases}
          value={params.row.healthSensors ? (params.row.healthSensors as any).centiLuxExternal : undefined}
          lastUpdatedAt={params.row.healthSensors?.updatedAt}
          formatValue={(value) => `${value}`}
        />
      ),
    },
    {
      field: 'hasDoor',
      headerName: 'Door',
      renderCell: (params: {row: BoardRowProps, field: any}) => {
        let label // : string | undefined
        if (params.row.healthSensors?.door !== undefined) {
          if (params.row.healthSensors?.door === 0) {
            label = 'Door: Open'
          } else {
            label = 'Door: Closed'
          }
        }
        return (
          <SensorsCell sensorName={params.field} enabled={params.row.hasDoor} value={label} lastUpdatedAt={params.row.healthSensors?.updatedAt} formatValue={(value) => `${value}`}/>
        )
      },
    },
    {
      field: 'battery',
      headerName: 'Battery',
      renderCell: (params: {row: BoardRowProps}) => (
         <BatteryCell isAelerBoard={params.row.provider === 'aeler'} boardBatteryStatus={params.row.boardBatteryStatus}/>
      ),
    },
    {
      field: 'latestMessage',
      headerName: 'Latest message',
      renderCell: (params: {row: BoardRowProps}) => (
        <LatestMessageCell latestMessage={params.row.latestMessage}/>
      ),
    },
  ] as GridColDef[],
  [])

  // const rowData = filterBoards(depots.map(l => mapToBoardRow(l, companies, depots)), searchFilter)

  const handleSelectAllClick = genericHandleSelectAllClick(filteredBoards.boards, setSelected)
  const handleRowClick = genericHandleRowClick(selected, setSelected)

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const handleFiltersChange = (boards: BoardRowDataProps[], chips: FilterChip[] | null) => {
    const numOfFilters = (searchFilter !== '' ? 1 : 0) + (chips ? chips.length : 0)
    setFilteredBoards({ boards: filterBoards(boards, searchFilter), numOfFilters })
    setSelected([])
    setChips(chips)
  }

  const handleCreateBoard = (board: Board) => {
    _dispatch(createBoard(board, board.provider))
  }

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, boards: columnState }))
  }

  return (
    <Box width='100%' id='boards-list' display='flex' flexDirection='column' >
      <Box mt={2} mb={1} display='flex' alignItems='center' flexWrap='wrap'>
        <Box flexGrow={1} display='flex' alignItems='center' flexWrap='wrap'>
          <Searchbar placeholder={'Search boards...'} filter={searchFilter} setFilter={setSearchFilter} clearAll={handleClearSearch} />
          {/* <EndBoard ml={2} depots={depots.filter(o => selected.includes(o.orderId))} onEndBoard={handleEndBoards}/> */}
          {
            (loadingStatusAeler || loadingStatusContainerId || loadingStatusKizy || loadingStatusNexxiot) &&
            <CircularProgress sx={{ marginLeft: '16px' }} size={20}/>
          }
        </Box>
        <NewBoard onCreate={handleCreateBoard} />
        <FilterButton
          icon
          disabled={false}
          data={rowData}
          dataFilter={boardFilter}
          options={boardOptions}
          getOptions={getBoardOptions}
          onFilter={handleFiltersChange}
          filters={boardFilters}
          setFilters={setFilters}
        />
        { !ENABLE_DATAGRID
          ? <FilterColumns type='board'/>
          : ''
        }
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
            // disableColumnFilter
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
            rows={ filteredBoards.boards }
            getRowId={ row => row.id }
            // rowsPerPageOptions={[25, 50, 100, 200]}
            // pageSize={ pageSize }
            // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            // pagination
          />
          : <GenericTable
            disableSelect
            headerCells={boardTableHeadCells}
            order={boardSortBy.order}
            orderBy={boardSortBy.orderBy}
            setSortBy={(sortBy: SortByUI) => _dispatch(setBoardSortBy(sortBy))}
            rows={filteredBoards.boards}
            selected={selected}
            handleSelectAllClick={handleSelectAllClick}
            rowComponent={({ ...board }: BoardRowProps) => (
              <BoardRow
                {...board}
                key={board.id + Math.random()}
                // handleRowClick={handleRowClick}
                isSelected={isSelected(board.id)}
              />
            )}
          />
        }
      </Box>
    </Box >
  )
}

export default BoardsView
