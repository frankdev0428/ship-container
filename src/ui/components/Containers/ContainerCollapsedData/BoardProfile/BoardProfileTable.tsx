
import React, { useEffect, useMemo, useState } from 'react'
import { alpha, Box, CircularProgress, styled, Typography, useTheme, useThemeProps } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { DataGridPro, gridClasses, GridColDef, GridToolbarColumnsButton, useGridApiRef } from '@mui/x-data-grid-pro'

import { ENABLE_DATAGRID } from '../../../../globals'
import { BoardsProfileBoardSourceEnum, ContainerWithProfile } from '../../../../../services/equipment/types'
import { AppState } from '../../../../../store'
import { setBoardProfileFilters, setBoardProfileSortBy, setDatagridState } from '../../../../../store/ui/actions'
import { SortByUI } from '../../../../../store/ui/types'
import { Loading } from '../../../shared/component_utils'
import CollapsibleChips from '../../../shared/Filter/CollapsibleChips'
import FilterButton, { FilterChip, StateFilter } from '../../../shared/Filter/FilterButton'
import FilterColumns from '../../../shared/GenericTable/FilterColumns'
import { TableHeadCell } from '../../../shared/GenericTable/SortableTableHead'
import GenericTable from '../../../shared/GenericTable/Table'
import { genericHandleSelectAllClick } from '../../../shared/GenericTable/utils'
import Searchbar from '../../../shared/Search'
import { getTimeLabel, ENABLED_BOARD_EDITING_FLOW, setDefaultsDataGridState } from '../../../shared/utils'
import { DisableableTypography } from '../../../Utils/Typography'
import LatestMessageCell from '../../../Boards/LatestMessageCell'
import { CustomOverflowValue } from '../../../shared/CustomOverflowValue'
import { Board } from '../../../../../services/boards/types'

import BoardProfileProfileRow, { BoardProfileRowDataProps, BoardProfileRowProps, mapToBoardProfileRow } from './BoardProfileRow'
import { boardProfileFilter, boardProfileOptions, filterBoardsProfile, getBoardsProfileOptions } from './Filter/utils'
import NewBoardProfile from './NewBoardProfile'
import DeleteBoardProfile from './DeleteBoardProfile'
import PatchBoardProfile from './PatchBoardProfile'

const DISABLED_OPACITY = 0.2

const StyledDataGrid = styled(DataGridPro)(({ theme }) => ({
  [`& .${gridClasses.row}.disabled`]: {
    backgroundColor: '#f9f9fb',
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, DISABLED_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        DISABLED_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          DISABLED_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            DISABLED_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}))

export const inititalBoardProfileHeadCells: TableHeadCell[] = [
  // { id: 'id', isSortable: true, label: 'Id', hide: false, width: 270 },
  { id: 'containerId', isSortable: true, label: 'Container id', hide: false },
  { id: 'boardId', isSortable: true, label: 'Board id', hide: false },
  { id: 'boardSource', isSortable: true, label: 'Board source', hide: false },
  { id: 'createdAt', isSortable: true, label: 'Created at', hide: false },
  { id: 'updatedAt', isSortable: true, label: 'Updated at', hide: false },
  { id: 'installDate', isSortable: true, label: 'Install date', hide: false },
  { id: 'installComments', isSortable: true, label: 'Install comments', hide: true },
  { id: 'installTechnicianId', isSortable: true, label: 'Install technician id', hide: true },
  { id: 'installLocation', isSortable: true, label: 'Install location', hide: true },
  { id: 'removalDate', isSortable: true, label: 'Removal date', hide: false },
  { id: 'removalComments', isSortable: true, label: 'Removal comments', hide: true },
  { id: 'removalTechnicianId', isSortable: true, label: 'Removal technician id', hide: true },
  { id: 'removalLocation', isSortable: true, label: 'Removal location', hide: true },
  { id: 'boardPairedLatestMessage', isSortable: false, label: 'Working board paired?', hide: true },
  { id: 'actions', isSortable: false, align: 'center', label: <FilterColumns type='boardProfile' size='small' />, hide: false, width: 68 },
]

const ContainerBoardsProfile = ({ loading, container }: { container?: ContainerWithProfile, loading?: boolean }) => {
  const boards_ = useSelector((state: AppState) => state.boards.boards)
  const loadingStatusAeler = useSelector((state: AppState) => state.boards.loadingStatusAeler)
  const loadingStatusNexxiot = useSelector((state: AppState) => state.boards.loadingStatusNexxiot)
  const loadingStatusKizy = useSelector((state: AppState) => state.boards.loadingStatusKizy)

  const loadingBoards = loadingStatusAeler || loadingStatusNexxiot || loadingStatusKizy

  const boardProfileFilters = useSelector((state: AppState) => state.ui.boardProfileFilters)
  const boardProfileTableHeadCells = useSelector((state: AppState) => state.ui.boardProfileTableHeadCells)
  const boardProfileSortBy = useSelector((state: AppState) => state.ui.boardProfileSortBy)
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)

  // const [selected, setSelected] = useState<string[]>([])
  const [rowData, setProfileBoards] = useState<BoardProfileRowDataProps[]>([])
  const [filteredBoardProfiles, setFilteredBoardProfiles] = useState<{ boards: BoardProfileRowDataProps[], numOfFilters: number}>({ boards: [], numOfFilters: 0 })
  const [searchFilter, setSearchFilter] = useState('')
  const [chips, setChips] = useState<FilterChip[] | null>(null)

  const _dispatch = useDispatch()
  const apiRef = useGridApiRef()
  const theme = useTheme()

  const containerBoardProfile = (container?.containerboardpairingprofiles && container?.containerboardpairingprofiles.length > 0) ? container?.containerboardpairingprofiles : []

  const showDate = (date?: Date, disabled?: boolean) => {
    if (date) {
      const availableToText = getTimeLabel(date, 'dateHourWithTz')
      return (
        <CustomOverflowValue
          dataKey={'containersBoardsProfile'}
          value={availableToText}
          {...disabled && { typographyColor: theme.palette.text.disabled }}
        />
      )
    } else return (<DisableableTypography noWrap variant='body2'>{undefined}</DisableableTypography>)
  }

  useEffect(() => {
    if (containerBoardProfile !== undefined && containerBoardProfile.length > 0) {
      setProfileBoards(filterBoardsProfile(containerBoardProfile.map(b => mapToBoardProfileRow(b)), searchFilter))
    } else {
      setProfileBoards([])
    }
  }, [searchFilter, JSON.stringify(containerBoardProfile)])

  useEffect(() => {
    if (ENABLE_DATAGRID && datagridState?.containersBoardsProfile) {
      apiRef.current.restoreState(setDefaultsDataGridState(datagridState.containersBoardsProfile))
    }
  }, [])

  const columns = useMemo(() => {
    const columns = [
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        hideable: false,
        filterable: false,
        minWidth: 120,
        renderHeader: () => (
          <GridToolbarColumnsButton style={{ minWidth: 36 }} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
        ),
        renderCell: (params: { row: BoardProfileRowProps, id: string }) => {
          const board = {
            boardId: params.row.boardId,
            containerId: params.row.containerId,
            boardSource: params.row.boardSource as unknown as BoardsProfileBoardSourceEnum | undefined,
            installDate: params.row.installDate,
            removalDate: params.row.removalDate,
            installComments: params.row.installComments,
            removalComments: params.row.removalComments,
            installTechnicianId: params.row.installTechnicianId,
            removalTechnicianId: params.row.removalTechnicianId,
            installLocationId: params.row.installLocationId,
            removalLocationId: params.row.removalLocationId,
            installLocationName: params.row.installLocationName,
            removalLocationName: params.row.removalLocationName,
          }
          return (
          <Box display='flex' flexDirection='row'>
            {
              ENABLED_BOARD_EDITING_FLOW &&
              <>
                <PatchBoardProfile
                  boardPairingProfileId={params.row.id}
                  board={board}
                />
                <PatchBoardProfile
                  boardPairingProfileId={params.row.id}
                  board={board}
                  unpairBoard
                  disabled={board.removalDate !== undefined && board.removalDate !== null}
                />
              </>
            }
            <DeleteBoardProfile id={params.row.id} boardId={board.boardId} containerId={board.containerId}/>
          </Box>
          )
        },
        flex: 0.5,
      },
      {
        field: 'containerId',
        headerName: 'Container id',
        renderCell: (params: { row: BoardProfileRowProps }) => (
          <CustomOverflowValue
            dataKey={'containersBoardsProfile'}
            value={params.row.containerId}
            {...params.row.removalDate && { typographyColor: theme.palette.text.disabled }}
          />
        ),
        flex: 1,
      },
      {
        field: 'boardId',
        headerName: 'Board id',
        renderCell: (params: { row: BoardProfileRowProps }) => (
          <CustomOverflowValue
            dataKey={'containersBoardsProfile'}
            value={params.row.boardId}
            {...params.row.removalDate && { typographyColor: theme.palette.text.disabled }}
          />
        ),
        flex: 1,
      },
      {
        field: 'boardSource',
        headerName: 'Board source',
        renderCell: (params: { row: BoardProfileRowProps }) => (
          <CustomOverflowValue
            dataKey={'containersBoardsProfile'}
            value={params.row.boardSource}
            {...params.row.removalDate && { typographyColor: theme.palette.text.disabled }}
          />
        ),
        flex: 1,
      },
      {
        field: 'createdAt',
        headerName: 'Created at',
        renderCell: (params: { row: BoardProfileRowProps }) => (
          showDate(params.row.createdAt, params.row.removalDate !== undefined)
        ),
        flex: 1,
      },
      {
        field: 'updatedAt',
        headerName: 'Updated at',
        renderCell: (params: { row: BoardProfileRowProps }) => (
          showDate(params.row.updatedAt, params.row.removalDate !== undefined)
        ),
        flex: 1,
      },
      {
        field: 'installDate',
        headerName: 'Install date',
        renderCell: (params: { row: BoardProfileRowProps }) => (
          showDate(params.row.installDate, params.row.removalDate !== undefined)
        ),
        flex: 1,
      },
      {
        field: 'installComments',
        headerName: 'Install comments',
        renderCell: (params: {row: BoardProfileRowProps}) => (
          <CustomOverflowValue
            dataKey={'containersBoardsProfile'}
            value={params.row.installComments}
            {...params.row.removalDate && { typographyColor: theme.palette.text.disabled }}
          />
        ),
        flex: 1,
      },
      {
        field: 'installTechnicianId',
        headerName: 'Install technician id',
        renderCell: (params: {row: BoardProfileRowProps}) => (
          <CustomOverflowValue
            dataKey={'containersBoardsProfile'}
            value={params.row.installTechnicianId}
            {...params.row.removalDate && { typographyColor: theme.palette.text.disabled }}
          />
        ),
        flex: 1,
      },
      {
        field: 'installLocation',
        headerName: 'Install location',
        renderCell: (params: {row: BoardProfileRowProps}) => {
          const content = params.row.installLocationName && params.row.installLocationId
            ? `${params.row.installLocationName}, ${params.row.installLocationId}`
            : params.row.installLocationName && !params.row.installLocationId
              ? params.row.installLocationName
              : params.row.installLocationId && !params.row.installLocationName
                ? params.row.installLocationId
                : undefined
          return (
          <CustomOverflowValue
            dataKey={'containersBoardsProfile'}
            value={content}
            {...params.row.removalDate && { typographyColor: theme.palette.text.disabled }}
          />
          )
        },
        flex: 1,
      },
      {
        field: 'removalDate',
        headerName: 'Removal date',
        renderCell: (params: { row: BoardProfileRowProps }) => (
          showDate(params.row.removalDate, params.row.removalDate !== undefined)
        ),
        flex: 1,
      },
      {
        field: 'removalComments',
        headerName: 'Removal comments',
        renderCell: (params: {row: BoardProfileRowProps}) => (
          <CustomOverflowValue
            dataKey={'containersBoardsProfile'}
            value={params.row.removalComments}
            {...params.row.removalDate && { typographyColor: theme.palette.text.disabled }}
          />
        ),
        flex: 1,
      },
      {
        field: 'removalTechnicianId',
        headerName: 'Removal technician id',
        renderCell: (params: {row: BoardProfileRowProps}) => (
          <CustomOverflowValue
            dataKey={'containersBoardsProfile'}
            value={params.row.removalTechnicianId}
            {...params.row.removalDate && { typographyColor: theme.palette.text.disabled }}
          />
        ),
        flex: 1,
      },
      {
        field: 'removalLocation',
        headerName: 'Removal location',
        renderCell: (params: {row: BoardProfileRowProps}) => {
          const content = params.row.removalLocationName && params.row.removalLocationId
            ? `${params.row.removalLocationName}, ${params.row.removalLocationId}`
            : params.row.removalLocationName && !params.row.removalLocationId
              ? params.row.removalLocationName
              : params.row.removalLocationId && !params.row.removalLocationName
                ? params.row.removalLocationId
                : undefined
          return (
          <CustomOverflowValue
            dataKey={'containersBoardsProfile'}
            value={content}
            {...params.row.removalDate && { typographyColor: theme.palette.text.disabled }}
          />
          )
        },
        flex: 1,
      },
      {
        field: 'boardPairedLatestMessage',
        headerName: 'Working board paired?',
        renderCell: (params:{ row: BoardProfileRowProps }) => (
          <LatestMessageCell
            latestMessage={boards_.find((b) => b.boardId === params.row.boardId)?.latestMessage}
            // latestMessage={indexedBoards[params.row.boardId]?.latestMessage}
            disabledTypo={params.row.removalDate !== undefined}
          />
        ),
        flex: 1,
      },
    ] as GridColDef[]

    if (ENABLE_DATAGRID && datagridState?.containersBoardsProfile && apiRef?.current?.exportState) {
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
  }, [loadingBoards])

  const handleClearSearch = () => {
    setSearchFilter('')
  }

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, containersBoardsProfile: columnState }))
  }

  const setFilters = (filters: StateFilter[]) => _dispatch(setBoardProfileFilters(filters))

  const handleFiltersChange = (boards: BoardProfileRowDataProps[], chips: FilterChip[] | null) => {
    const numOfFilters = (searchFilter !== '' ? 1 : 0) + (chips ? chips.length : 0)
    setFilteredBoardProfiles({ boards: boards, numOfFilters })
    setChips(chips)
  }

  return (
    <Box width='100%' height='100%' id='boards-profile-list' display='flex' flexDirection='column' >
      <Box mb={1} display='flex' alignItems='center' flexWrap='wrap'>
        <Box flexGrow={1} display='flex' alignItems='center' flexWrap='wrap'>
          <Searchbar placeholder={'Search boards...'} filter={searchFilter} setFilter={setSearchFilter} clearAll={handleClearSearch} />
          { (!rowData) && <CircularProgress/> }
        </Box>
        {container && <NewBoardProfile ml={2} mr={2} containerId={container.containerId} />}
        <FilterButton
          disabled={loading}
          data={rowData}
          dataFilter={boardProfileFilter}
          options={boardProfileOptions}
          getOptions={getBoardsProfileOptions}
          onFilter={handleFiltersChange}
          filters={boardProfileFilters}
          setFilters={setFilters}
        />
      </Box>
      <Box mb={1}>
        <CollapsibleChips open={Boolean(chips?.length)} chips={chips} />
      </Box>
      <Box display='flex' flexDirection='column' overflow='hidden' height={'100%'} >
        { ENABLE_DATAGRID
          ? <StyledDataGrid
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
            rows={ filteredBoardProfiles.boards }
            getRowId={ row => row.id }
            loading={loading}
            getRowClassName={(params) => {
              return params.row.removalDate && params.row.installDate ? 'disabled' : 'enabled'
            }}
          />
          : <GenericTable
              disableSelect
              headerCells={boardProfileTableHeadCells}
              order={boardProfileSortBy.order}
              orderBy={boardProfileSortBy.orderBy}
              setSortBy={(sortBy: SortByUI) => _dispatch(setBoardProfileSortBy(sortBy))}
              rows={filteredBoardProfiles.boards}
              rowComponent={({ ...board }: BoardProfileRowProps) => (
                <BoardProfileProfileRow
                  {...board}
                  key={board.id}
                  boardPairedLatestMessage={boards_.find((b) => b.boardId === board.boardId)?.latestMessage}
                />
              )}
            />
        }
      </Box>
    </Box >
  )
}

interface BoardProfileTableProfileProps {
  containerId?: string;
  boardIds?: string[];
}

const BoardProfileTableProfile = ({ containerId, boardIds }: BoardProfileTableProfileProps): JSX.Element => {
  const loadingStatus = useSelector((state: AppState) => state.equipment.loadingStatus)

  const containers = useSelector((state: AppState) => state.equipment.containers)
  const container = containers.find(c => c.containerId === containerId)

  return (
    <Box id='boards-table-wrapper' display='flex' flexDirection={'column'} overflow='hidden' height={'40vh'} maxHeight='40vh'>
      <ContainerBoardsProfile loading={loadingStatus} container={container}/>
    </Box>
  )
}

export default BoardProfileTableProfile
