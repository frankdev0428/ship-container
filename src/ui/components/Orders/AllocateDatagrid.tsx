import React, { useEffect, useMemo } from 'react'
import { Box, styled } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { DataGridPro, GridColDef, GridToolbarColumnsButton, GRID_CHECKBOX_SELECTION_COL_DEF, GRID_CHECKBOX_SELECTION_FIELD, GRID_DETAIL_PANEL_TOGGLE_COL_DEF, GRID_DETAIL_PANEL_TOGGLE_FIELD, useGridApiRef } from '@mui/x-data-grid-pro'

import { AppState } from '../../../store'
import { getTimeLabel } from '../shared/utils'
import { ENABLE_DATAGRID } from '../../globals'
import { CustomOverflowValue } from '../shared/CustomOverflowValue'
import { ColoredDot } from '../shared/ColoredDot'
import { setDatagridState } from '../../../store/ui/actions'

import { showAvailableFrom, showAvailableTo, useContainerStatusMap, ContainerRowDataProps } from './AllocationRow'

interface AllocateDatagridProps {
  loading?: boolean
  rowData: ContainerRowDataProps[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

const StyledDataGrid = styled(DataGridPro)({
  '&.Mui-selected': {
    backgroundColor: '#EBF0F8',
  },
})

const AllocateDatagrid = ({ loading, rowData, selectedIds, onSelectionChange }: AllocateDatagridProps): JSX.Element => {
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)

  const _dispatch = useDispatch()
  const apiRef = useGridApiRef()

  useEffect(() => {
    if (ENABLE_DATAGRID && datagridState?.allocate && apiRef?.current?.restoreState) {
      apiRef.current.restoreState(datagridState.allocate)
      // apiRef.current.setSelectionModel(selectedIds)
    }
  }, [])

  const statusMap = useContainerStatusMap()

  const columns = useMemo(() => {
    const columns = [
      {
        ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
        // field: '__detail_panel_toggle__',
        headerName: 'Expand/Collapse',
        hideable: false,
        renderHeader: () => (
          <GridToolbarColumnsButton style={{ minWidth: 36 }} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
        ),
        renderCell: () => <></>,
      },
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        headerName: 'Checkbox',
        hideable: false,
      },
      {
        field: 'id',
        headerName: 'Container Nº',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue
            dataKey={'allocate'}
            value={params.row.id}
            isLink
            to={`/ecosystem/fleet-management/containers?containerId=${params.row.id}`}
          />
        ),
        minWidth: 50,
      },
      {
        field: 'operationalStatus',
        headerName: 'Status',
        renderCell: (params: {row: ContainerRowDataProps}) => {
          return (
            <Box display='flex' alignItems='center' overflow='hidden'>
              <ColoredDot color={statusMap.get(params.row.status)?.color} />
              <CustomOverflowValue dataKey={'allocate'} value={statusMap.get(params.row.status)?.label} />
            </Box>
          )
        },
        flex: 1,
      },
      {
        field: 'allocFromPlanned',
        headerName: 'Alloc. from',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue
            dataKey={'allocate'}
            value={params.row.allocFromPlanned ? getTimeLabel(params.row.allocFromPlanned, 'dateHourWithTz') : undefined}
          />
        ),
        flex: 1,
      },
      {
        field: 'allocToPlanned',
        headerName: 'Alloc. until',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue
            dataKey={'allocate'}
            value={params.row.allocToPlanned ? getTimeLabel(params.row.allocToPlanned, 'dateHourWithTz') : undefined}
          />
        ),
        flex: 1,
      },
      {
        field: 'returnLocation',
        headerName: 'Return location',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'allocate'} value={params.row.returnLocation} />
        ),
        flex: 1,
      },
      {
        field: 'availableFrom',
        headerName: 'Avail. from',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          showAvailableFrom(params.row.availableFrom)
        ),
        flex: 1,
      },
      {
        field: 'availableTo',
        headerName: 'Avail. until',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          showAvailableTo(params.row.availableFrom, params.row.availableTo)
        ),
        flex: 1,
      },
      {
        field: 'idleDays',
        headerName: 'Idle time',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'allocate'} value={params.row.idleDays} />
        ),
        flex: 1,
      },
      {
        field: 'currentLocation',
        headerName: 'Location',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'allocate'} value={params.row.currentLocation } />
        ),
        flex: 1,
      },
      {
        field: 'containerVersion',
        headerName: 'Version',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'allocate'} value={params.row.containerVersion} />
        ),
        flex: 1,
      },
      {
        field: 'containerCertificateDate',
        headerName: 'Cert. Date',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue
            dataKey={'allocate'}
            value={params.row.containerCertificateDate ? getTimeLabel(params.row.containerCertificateDate, 'dateHourWithTz') : undefined}
          />
        ),
        flex: 1,
      },
      {
        field: 'containerDoorType',
        headerName: 'TIR locking plate',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'allocate'} value={params.row.containerDoorType} />
        ),
        flex: 1,
      },
      {
        field: 'containerFloorType',
        headerName: 'Floor insulation',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'allocate'} value={params.row.containerFloorType} />
        ),
        flex: 1,
      },
      {
        field: 'comment',
        headerName: 'Comment',
        renderCell: (params: {row: ContainerRowDataProps}) => (
          <CustomOverflowValue dataKey={'allocate'} value={params.row.comment } />
        ),
        flex: 1,
      },
    ] as GridColDef[]

    if (datagridState?.allocate && apiRef?.current?.exportState) {
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
  }, [apiRef?.current?.instanceId])

  const handleDispatch = () => {
    const columnState = apiRef.current.exportState()
    _dispatch(setDatagridState({ ...datagridState, allocate: columnState }))
  }

  return (
    <StyledDataGrid

      apiRef={ apiRef }
      checkboxSelection
      disableColumnFilter
      disableSelectionOnClick
      initialState={{
        columns: { columnVisibilityModel: {} },
        pinnedColumns: { left: [GRID_DETAIL_PANEL_TOGGLE_FIELD, GRID_CHECKBOX_SELECTION_FIELD] },
      }}
      loading={loading}
      // IMPORTANT: MUST USE keepNonExistentRowsSelected
      // Because of the async API calls, the selection model may reference ids that don't yet exist in the data untill the API returns;
      // this will happen when navigating from another page
      keepNonExistentRowsSelected
      localeText={{ toolbarColumns: '' }}
      onColumnOrderChange={ handleDispatch }
      onColumnVisibilityModelChange={ handleDispatch }
      onColumnWidthChange={ handleDispatch }
      onPinnedColumnsChange={ handleDispatch }
      onSortModelChange={ handleDispatch }
      selectionModel={selectedIds}
      onSelectionModelChange={(rowIds) => {
        onSelectionChange(rowIds as string[])
      }}
      getDetailPanelContent={() => null}
      columns={ columns }
      rows={ rowData || [] }
      getRowId={ row => row.id }
    />
  )
}

export default AllocateDatagrid
