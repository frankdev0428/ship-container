import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import HistoryIcon from '@mui/icons-material/History'
import moment from 'moment'

import Typography, { DisableableTypography } from '../Utils/Typography'
import OverflowTooltip from '../shared/OverflowTooltip'
import { TableHeadCell } from '../../../store/ui/types'
import { LAST_UPDATED_DELAY } from '../shared/utils'

const StyledParentBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
})

const StyledInnerBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
})

const getMeasure = new Map([
  ['hasShock', 'events'],
  ['hasTempExt', 'ºC'],
  ['hasTempInt', 'ºC'],
  ['hasPressureExt', 'hPa'],
  ['hasPressureInt', 'hPa'],
  ['hasGases', '%'],
  ['hasLightInt', 'LM'],
  ['hasLightExt', 'LM'],
  ['hasHumExt', '%'],
  ['hasHumInt', '%'],
  ['hasDoor', ''],
  ['hasRFID', '%'],
])

interface SensorsCellProps {
  sensorName: string;
  value?: number | string;
  enabled?: boolean;
  lastUpdatedAt?: Date;
  level?: string;
  headCells?: TableHeadCell[],
  formatValue: (val: string, ...args: any[]) => string;
}

const SensorsCell = ({ sensorName, value, enabled, lastUpdatedAt, headCells }: SensorsCellProps): JSX.Element => {
  const theme = useTheme()

  if (!enabled) {
    return <DisableableTypography variant='body2' />
  }

  const isValidDate = lastUpdatedAt instanceof Date && !isNaN(lastUpdatedAt.getTime())

  const delay = lastUpdatedAt && isValidDate ? (new Date().getTime() - lastUpdatedAt.getTime()) : undefined
  const outdated = delay ? moment.duration(delay).asHours() > LAST_UPDATED_DELAY : undefined
  const humanDelay = isValidDate && moment.duration(delay).humanize()

  const outdatedStatus = (updatedDate?: Date): true | false | undefined => {
    if (lastUpdatedAt && updatedDate && outdated) return true
    if (lastUpdatedAt && updatedDate && !outdated) return false
    if (lastUpdatedAt && !updatedDate) return undefined
    if (!lastUpdatedAt && !updatedDate) return undefined
  }

  const statusColor = outdatedStatus(lastUpdatedAt) === true ? theme.palette.error.main : outdatedStatus(lastUpdatedAt) === undefined ? theme.palette.disabled?.main : theme.palette.success.main
  const value_ = typeof value === 'number' ? value.toFixed(1) : value
  const updatedAtLabel = `${humanDelay} ago`

  const valueLabel = value_ ? `${value_} ${sensorName && getMeasure.get(sensorName)}` : '-'
  const tooltipTitle = humanDelay
    ? <div>
      <div>{valueLabel}</div>
      <div>{updatedAtLabel}</div>
    </div>
    : ''

  return (
    <Box id='table-sensors-cell' overflow='hidden' >
      <StyledParentBox id='sensors-cell-value'>
         {value_
           ? <StyledInnerBox>
            {outdated
              ? <HistoryIcon sx={{ color: theme.palette.text.secondary, marginRight: '4px' }} fontSize={'small'}/>
              : <CheckIcon sx={{ color: theme.palette.success.main, marginRight: '4px' }} fontSize={'small'}/> }
            <OverflowTooltip title={tooltipTitle} deps={[headCells]} >
              <DisableableTypography
                  noWrap
                  variant='caption'
                  sx={{ color: outdated ? theme.palette.text.secondary : theme.palette.success.main, lineHeight: 1, width: '100%', textAlign: 'start' }}
              >
                  {valueLabel}
              </DisableableTypography>
              </OverflowTooltip>
            </StyledInnerBox>
           : <StyledInnerBox>
              <CloseIcon sx={{ color: theme.palette.error.main, marginRight: '4px' }} fontSize={'small'}/>
              <DisableableTypography
                {...enabled && { color: 'error' }}
                sx={{ /* color: statusColor, */ lineHeight: 1, width: '100%', textAlign: 'start' }}
                disabled={!enabled}
                // disabled
                noWrap
                variant='caption'
              >
                {valueLabel}
              </DisableableTypography>
            </StyledInnerBox>

          }
          { humanDelay && enabled &&
          <DisableableTypography {...!value_ && { color: 'error' }} sx={{ ...(value_ && { color: outdated ? theme.palette.text.secondary : theme.palette.success.main }), lineHeight: 1, width: '100%', textAlign: 'start' }} noWrap variant='caption' >
            {updatedAtLabel}
          </DisableableTypography>}
          </StyledParentBox>
    </Box>
  )
}

export default SensorsCell
