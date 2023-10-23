import React from 'react'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import HistoryIcon from '@mui/icons-material/History'

import { DisableableTypography } from '../Utils/Typography'
import OverflowTooltip from '../shared/OverflowTooltip'
import { getTimeLabel, isDateOutdated, updatedDateLabel } from '../shared/utils'
import { LatestMessage } from '../../../services/boards/types'

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

const StyledBatteryTypography = styled(DisableableTypography, {
  shouldForwardProp: (prop) => prop !== 'latestMessage' && prop !== 'dateOutdated' && prop !== 'disabled',
})<{ latestMessage?: LatestMessage, dateOutdated?: boolean, disabled?: boolean }>((
  { latestMessage, dateOutdated, disabled, theme },
) => ({
  color: theme.palette.success.main,
  ...!latestMessage && { color: theme.palette.error.main },
  ...dateOutdated && { color: theme.palette.text.secondary },
  ...disabled && { color: theme.palette.text.disabled },
}))

interface LatestMessageCellProps {
  latestMessage?: LatestMessage;
  isBoardPaired?: boolean;
  disabledTypo?: boolean;
}

const LatestMessageCell = ({ latestMessage, isBoardPaired, disabledTypo }: LatestMessageCellProps): JSX.Element => {
  if (isBoardPaired === false) {
    return <DisableableTypography variant='body2' />
  }
  const latestMessageDate = latestMessage?.messageDate
  const latestMessageType = latestMessage?.messageType

  const dateOutdated = isDateOutdated(latestMessageDate)
  const lastUpdatedAtLabel = latestMessageDate ? updatedDateLabel(latestMessageDate) : undefined

  const tooltipDateLabel = latestMessageDate ? getTimeLabel(latestMessageDate, 'dateHourWithTz') : ''
  const tooltipLabel = latestMessageType && tooltipDateLabel ? `${latestMessageType} - ${tooltipDateLabel}` : ''

  return (
    <Box id='table-battery-cell' overflow='hidden' >
      <StyledParentBox id='battery-cell-value'>
         {
          latestMessage
            ? <StyledInnerBox>
                { dateOutdated && <StyledHistoryIcon fontSize={'small'}/>}
                <OverflowTooltip title={tooltipLabel}>
                  <StyledBatteryTypography
                    dateOutdated={dateOutdated}
                    latestMessage={latestMessage}
                    disabled={disabledTypo}
                    noWrap
                    variant='caption'
                  >
                    {latestMessageType}
                  </StyledBatteryTypography>
                </OverflowTooltip>
              </StyledInnerBox>
            : <StyledInnerBox>
                <CloseIcon color='error' fontSize={'small'}/>
              </StyledInnerBox>
          }
          {
            lastUpdatedAtLabel &&
              <StyledBatteryTypography
                latestMessage={latestMessage}
                dateOutdated={dateOutdated}
                {...!latestMessage && { color: 'error' }}
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

export default LatestMessageCell
