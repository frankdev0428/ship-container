import React from 'react'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import HistoryIcon from '@mui/icons-material/History'
import SouthIcon from '@mui/icons-material/South'
import NorthIcon from '@mui/icons-material/North'

import { DisableableTypography } from '../Utils/Typography'
import OverflowTooltip from '../shared/OverflowTooltip'
import { getTimeLabel, isDateOutdated, updatedDateLabel } from '../shared/utils'
import { BatteryStatus } from '../../../services/boards/types'

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
  gap: 4,
})

const StyledHistoryIcon = styled(HistoryIcon)(({ theme }) => ({
  color: theme.palette.text.secondary,
}))

const StyledNorthIcon = styled(NorthIcon, {
  shouldForwardProp: (prop) => prop !== 'batPercent',
})<{ batPercent?: number }>(({ batPercent, theme }) => ({
  color: theme.palette.text.secondary,
  ...batPercent && { color: theme.palette.warning.main },
  ...batPercent && batPercent < 30 && { color: theme.palette.error.main },
  ...batPercent && batPercent > 60 && { color: theme.palette.success.main },
}))

const StyledSouthIcon = styled(SouthIcon, {
  shouldForwardProp: (prop) => prop !== 'batPercent',
})<{ batPercent?: number }>(({ batPercent, theme }) => ({
  color: theme.palette.text.secondary,
  ...batPercent && { color: theme.palette.warning.main },
  ...batPercent && batPercent < 30 && { color: theme.palette.error.main },
  ...batPercent && batPercent > 60 && { color: theme.palette.success.main },
}))

const StyledBatteryTypography = styled(DisableableTypography, {
  shouldForwardProp: (prop) => prop !== 'batPercent' && prop !== 'dateOutdated',
})<{ batPercent?: number, dateOutdated?: boolean }>(({ batPercent, dateOutdated, theme }) => ({
  color: theme.palette.text.secondary,
  ...batPercent && { color: theme.palette.warning.main },
  ...batPercent && batPercent < 30 && { color: theme.palette.error.main },
  ...batPercent && batPercent > 60 && { color: theme.palette.success.main },
  ...dateOutdated && { color: theme.palette.text.secondary },
}))

interface BatteryCellProps {
  isAelerBoard?: boolean;
  boardBatteryStatus?: BatteryStatus;
}

const BatteryCell = ({ isAelerBoard, boardBatteryStatus }: BatteryCellProps): JSX.Element => {
  if (!isAelerBoard) {
    return <DisableableTypography variant='body2' />
  }

  const hasChargingInfo = boardBatteryStatus?.powerOutMeanValue !== undefined
  const isBatteryCharging = hasChargingInfo ? boardBatteryStatus?.powerOutMeanValue !== 0 : undefined

  const batPercent = boardBatteryStatus?.mostRecentBatteryPercentageValue

  const lastUpdatedAt = boardBatteryStatus?.mostRecentPowerBudgetTimeReceived

  const dateOutdated = isDateOutdated(lastUpdatedAt)
  const lastUpdatedAtLabel = lastUpdatedAt ? updatedDateLabel(lastUpdatedAt) : undefined

  const tooltipDate = boardBatteryStatus?.mostRecentPowerBudgetTime
  const readAtLabel = tooltipDate ? getTimeLabel(tooltipDate, 'dateHourWithTz') : ''
  const percentage = (batPercent && batPercent <= 100) ? batPercent : (batPercent && batPercent > 100) ? 100 : undefined

  const percentLabel = percentage ? `${percentage}%` : undefined

  const BatStatusIcon = hasChargingInfo
    ? isBatteryCharging
      ? StyledNorthIcon
      : StyledSouthIcon
    : undefined

  return (
    <Box id='table-battery-cell' overflow='hidden' >
      <StyledParentBox id='battery-cell-value'>
         {
          batPercent
            ? <StyledInnerBox>
                {
                  dateOutdated
                    ? <StyledHistoryIcon fontSize={'small'}/>
                    : BatStatusIcon && <BatStatusIcon sx={{ fontSize: '15px' }} batPercent={batPercent} fontSize={'small'}/>
                }
                <OverflowTooltip title={readAtLabel}>
                  <StyledBatteryTypography dateOutdated={dateOutdated} batPercent={batPercent} noWrap variant='caption'>
                    {percentLabel}
                  </StyledBatteryTypography>
                </OverflowTooltip>
              </StyledInnerBox>
            : <StyledInnerBox>
                <CloseIcon color='error' fontSize={'small'}/>
                {/* <DisableableTypography
                  color='error'
                  sx={{ lineHeight: 1, width: '100%', textAlign: 'start' }}
                  noWrap
                  variant='caption'
                >
                  {percentLabel}
                </DisableableTypography> */}
              </StyledInnerBox>
          }
          {
            lastUpdatedAtLabel &&
              <StyledBatteryTypography
                batPercent={batPercent}
                dateOutdated={dateOutdated}
                {...!percentLabel && { color: 'error' }}
                sx={{ lineHeight: 1, width: '100%', textAlign: 'start' }}
                noWrap
                variant='caption'
              >
                {lastUpdatedAtLabel}
              </StyledBatteryTypography>
          }
      </StyledParentBox>
    </Box>
  )
}

export default BatteryCell
