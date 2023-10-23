import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, styled, Tooltip, useTheme } from '@mui/material'
import { DataGridPro, GridColDef, GridComparatorFn, GridRenderCellParams, gridStringOrNumberComparator, GridValueGetterParams, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid-pro'
import MoreTimeIcon from '@mui/icons-material/MoreTime'
import LoginIcon from '@mui/icons-material/Login'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { formatDistanceStrict } from 'date-fns'

import Typography, { DisableableTypography } from '../Utils/Typography'
import { getTimeLabel } from '../shared/utils'
import { createAlertStatus, updateAlertStatus } from '../../../services/alerts/actions'
import { AppState } from '../../../store'
import IconButtonLoading from '../shared/IconButtonLoading'
import { EntityTypeEnum, PublicAlert } from '../../../services/alerts/types'
import { listCompanies } from '../../../services/customer/actions'
import { listFacilities } from '../../../services/places/actions'

const StyledDataGrid = styled(DataGridPro)({
  '.MuiDataGrid-columnSeparator': {
    display: 'none',
  },
  '&.MuiDataGrid-root': {
    // border: 'none',
  },
  '.MuiDataGrid-columnHeaderTitleContainer': {
    paddingLeft: 1,
    width: '100%',
  },
  '.MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
    display: 'none',
  },
  '.MuiDataGrid-cellCheckbox': {
    borderRight: 'none',
    padding: '0 !important',
  },
  '.MuiDataGrid-cell': {
    padding: '12px 16px',
    alignItems: 'flex-start',
  },
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '.MuiDataGrid-columnHeaderTitle': {
    color: '#68748d',
    fontSize: '10px',
  },
})

const severityColorMap = new Map<number, string>([
  [1, ''],
  [2, ' #FA8E1E'],
  [3, '#D64933'],
])

const severityStringMap = new Map<number, string>([
  [1, 'low'],
  [2, ' medium'],
  [3, 'high'],
])

const typeMap = new Map<string, {top: string, bottom: string}>([
  ['arrival', { top: 'upcoming', bottom: 'arrival' }],
  ['delayed-arrival', { top: 'delayed', bottom: 'arrival' }],
  ['departure', { top: 'upcoming', bottom: 'departure' }],
  ['delayed-departure', { top: 'delayed', bottom: 'departure' }],

])

const typeIconMap = new Map<string, any>([
  ['arrival', LoginIcon],
  ['delayed-arrival', MoreTimeIcon],
  ['departure', LoginIcon],
  ['delayed-departure', MoreTimeIcon],

])

interface NameAdminCellValue {
  severity: string;
  createdAt: Date;
}

const detailsSortComparator: GridComparatorFn = (v1, v2, param1, param2) => {
  // const severityComparatorResult = gridNumberComparator(
  //   (v1 as NameAdminCellValue).severity,
  //   (v2 as NameAdminCellValue).severity,
  //   param1,
  //   param2,
  // )

  // if (severityComparatorResult !== 0) {
  //   return severityComparatorResult
  // }

  return gridStringOrNumberComparator(
    (v1 as NameAdminCellValue).createdAt,
    (v2 as NameAdminCellValue).createdAt,
    param1,
    param2,
  )
}

const objectMap = new Map([
  ['order', 'orderId'],
  ['allocation', 'orderId'],
  ['container', 'containerId'],
  ['facility', 'facilityName'],
])

const SeverityBorder = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'severity',
})<{ severity: number }>(({ severity }) => ({
  position: 'absolute',
  left: 0,
  height: '100%',
  width: 3,
  backgroundColor: severityColorMap.get(severity),
}))

const columns: GridColDef[] = [
  {
    field: 'createdAt',
    width: 0,
    headerName: 'Created At',
    hideable: false,
    hide: true,
  },
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    headerName: 'Checkbox',
    width: 60,
    renderCell: (cellValues: GridRenderCellParams) => {
      const dispatch = useDispatch()
      const loadingAlertStatus = useSelector((state: AppState) => state.alerts.loadingAlertStatus)

      const readAt = cellValues.row.readAt

      return (
      <Box height={'100%'} width={'100%'} position={'relative'} >
        <SeverityBorder severity={cellValues.row.severity}/>
        <Box pl={2} pt={0.5}>
          <Tooltip
            title={readAt !== undefined
              ? `Mark as unread (read at ${getTimeLabel(readAt, 'dateHourWithTz')})`
              : 'Mark as read'}
          >
            {
              readAt
                ? <span>
                <IconButtonLoading
                  loading={loadingAlertStatus}
                  disabled={loadingAlertStatus}
                  onClick={() => {
                    dispatch(updateAlertStatus({ alertStateId: cellValues.row.alertStateId, readAt: null as any }))
                  }}
                >
                  <CheckCircleIcon color='disabled' />
                </IconButtonLoading>
              </span>
                // <CheckCircleIcon color='disabled' sx={{ m: 1 }}/>
                : <span>
                    <IconButtonLoading
                      loading={loadingAlertStatus}
                      disabled={loadingAlertStatus}
                      onClick={() => {
                        dispatch(createAlertStatus({ alertStateId: cellValues.row.alertStateId, readAt: new Date() }))
                      }}
                    >
                      <CheckCircleOutlineIcon color='primary' />
                    </IconButtonLoading>
                  </span>
            }
          </Tooltip>
        </Box>
      </Box>)
    },
  },
  {
    field: 'criterionId',
    headerName: 'TYPE',
    width: 200,
    sortable: true,
    renderCell: (cellValues: GridRenderCellParams) => {
      const topType = typeMap.get(cellValues.value)?.top
      const bottomType = typeMap.get(cellValues.value)?.bottom
      const theme = useTheme()
      const TypeIcon = typeIconMap.get(cellValues.value)

      return (
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          alignItems: 'flex-start',
          height: '100%',
        }}
        >
          { TypeIcon && <TypeIcon color='primary'/> }
          <Box >
            <DisableableTypography variant='body2' gutterBottom sx={{ fontWeight: 'bold' }} >
              {topType?.toUpperCase()}
            </DisableableTypography>
            <DisableableTypography variant='caption' color={theme.palette.text.unselected} >
              {bottomType?.toUpperCase()}
            </DisableableTypography>
          </Box>
        </Box>
      )
    },
  },
  {
    field: 'message',
    headerName: 'MESSAGE',
    width: 250,
    renderCell: (cellValues: GridRenderCellParams) => (
        <DisableableTypography variant='body2' color={severityColorMap.get(cellValues.row.severity)} sx={{ fontWeight: 'bold' }}>
          {cellValues.value?.toUpperCase()}
        </DisableableTypography>
    ),

  },
  {
    field: 'entityId',
    headerName: 'OBJECT',
    width: 250,
    renderCell: (cellValues: GridRenderCellParams) => {
      return (
      <DisableableTypography variant='body2' sx={{ fontWeight: 'bold' }}>
        {objectMap.get(cellValues.row.entityType) !== undefined &&
        cellValues.row.alertInfo[objectMap.get(cellValues.row.entityType) as string]}
      </DisableableTypography>
      )
    },
  },
  {
    field: 'details',
    headerName: 'DETAILS',
    flex: 1,
    sortable: true,
    sortComparator: detailsSortComparator,
    valueGetter: (params: GridValueGetterParams) => ({
      severity: params.row.severity,
      createdAt: params.row.createdAt,
    }),
    renderCell: (cellValues: GridRenderCellParams) => {
      const dateDistance = cellValues.row.createdAt
        ? formatDistanceStrict(cellValues.row.createdAt, new Date(), {
          addSuffix: true,
        })
        : formatDistanceStrict(cellValues.row.updatedAt, new Date(), {
          addSuffix: true,
        })

      return (
        <Box display='flex' flexDirection='column' width='100%'>
          <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
            <Box display='flex' flexDirection='row' gap={1}>
              {/* {cellValues.value.containers
                .map((c:string, i: number) =>
                <Typography color='#68748D' key={'c' + i}>
                  {c.toUpperCase() + (i !== cellValues.value.containers.length - 1 ? ',' : '')}
                </Typography>)} */}
                <DisableableTypography color='#68748D' variant='caption'>
                  {cellValues.row.alertInfo?.containerId}
                </DisableableTypography>
            </Box>
            <DisableableTypography variant='caption' color={severityColorMap.get(cellValues.row.severity)}>
              {severityStringMap.get(cellValues.row.severity)?.toUpperCase()}
            </DisableableTypography>
          </Box>
          <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center' width='100%'>
            <DisableableTypography variant='caption' color='#68748D'>
              {cellValues.row.alertInfo?.facilityName && cellValues.row.alertInfo?.customerName
                ? `${cellValues.row.alertInfo?.facilityName}, ${cellValues.row.alertInfo?.customerName}`
                : cellValues.row.alertInfo?.facilityName || cellValues.row.alertInfo?.customerName}
            </DisableableTypography>
            <Tooltip
              title={cellValues.row.createdAt ? getTimeLabel(cellValues.row.createdAt, 'dateHourWithTz') : '' }
              placement={'top'}>
            <DisableableTypography variant='overline'>{dateDistance?.toUpperCase() || ''}</DisableableTypography>
            </Tooltip>
          </Box>
        </Box>
      )
    },
  },
]

const NoDataMessage = (): JSX.Element => {
  return (
    <Box display='flex' flexDirection='column' alignItems='center' height='100%' justifyContent='center'>
      <Typography>There are no alerts yet.</Typography>
      <Typography>If you think you should have received alerts, please contact AELER.</Typography>
    </Box>
  )
}

interface NotificationsTableProps {
  alerts: PublicAlert[]
}

const NotificationsTable = ({ alerts }: NotificationsTableProps): JSX.Element => {
  const customers = useSelector((state: AppState) => state.company.companies)
  const facilities = useSelector((state: AppState) => state.places.facilities)
  const _dispatch = useDispatch()

  useEffect(() => {
    if (!customers.length) _dispatch(listCompanies({}))
    if (!facilities.length) _dispatch(listFacilities({}))
  }, [])

  const mappedAlerts = alerts.map((d) => {
    const customerName = d.alertInfo?.customerId ? customers.find((c) => c.companyId === d.alertInfo?.customerId)?.name : undefined
    const facilityName = d.alertInfo?.depotId ? facilities.find((f) => f.facilityId === d.alertInfo?.depotId)?.name : undefined
    return ({ ...d, alertInfo: { ...d.alertInfo, customerName: customerName, facilityName: facilityName }, id: d.alertStateId })
  })

  const selectionModel = mappedAlerts.filter((a) => a.readAt !== undefined).map((r) => r.id)

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <StyledDataGrid
        checkboxSelection
        disableSelectionOnClick
        hideFooter
        disableColumnMenu
        showCellRightBorder
        rows={mappedAlerts}
        columns={columns}
        selectionModel={selectionModel}
        getRowHeight={() => 'auto'}
        components={{ NoRowsOverlay: NoDataMessage }}
        initialState={{
          sorting: {
            sortModel: [{ field: 'createdAt', sort: 'desc' }],
          },
        }}
      />
    </Box>
  )
}

export default NotificationsTable
