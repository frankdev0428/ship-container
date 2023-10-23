import { Box, Divider, Grid, styled, useTheme } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'

import { EquipmentLeaseInput } from '../../../../services/lease/types'
import { AppState } from '../../../../store'
import { getTimeLabel } from '../../shared/utils'
import Typography, { DisableableTypography } from '../../Utils/Typography'

const StyledSectionBox = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
})

const StyledDetailsGrid = styled(Grid)({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '10px',
})

const StyledGridItem = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
})

const StyledDivider = styled(Divider)({
  marginBottom: '20px',
})

interface SummaryFormProps {
  order: EquipmentLeaseInput;
  allocatableContainersIds: string[];
}

const SummaryForm = ({ order, allocatableContainersIds }: SummaryFormProps): JSX.Element => {
  const facilities = useSelector((state: AppState) => state.places.facilities)
  const theme = useTheme()

  return (
    <Box>
      <StyledSectionBox>
        <Typography variant='subtitle2'>Order details</Typography>
        <StyledDivider/>
        <StyledDetailsGrid container>
          <StyledGridItem item xs={6}>
            <Typography variant='body2' sx={{ fontWeight: 'bold', color: theme.palette.text.unselected }}>
              Order ID
            </Typography>
            <DisableableTypography>{order.orderId}</DisableableTypography>
          </StyledGridItem>
          <StyledGridItem item xs={6}>
            <Typography variant='body2' sx={{ fontWeight: 'bold', color: theme.palette.text.unselected }}>
              Container units
            </Typography>
            <DisableableTypography>{order.units}</DisableableTypography>
          </StyledGridItem>
        </StyledDetailsGrid>
        <StyledDetailsGrid container>
        <StyledGridItem item xs={6}>
          <Typography variant='body2' sx={{ fontWeight: 'bold', color: theme.palette.text.unselected }}>
            Collection date
          </Typography>
          <DisableableTypography>
            {order.executionDate ? getTimeLabel(order.executionDate) : undefined}
          </DisableableTypography>
        </StyledGridItem>
        <StyledGridItem item xs={6}>
          <Typography variant='body2' sx={{ fontWeight: 'bold', color: theme.palette.text.unselected }}>
            Return date
          </Typography>
          <DisableableTypography>
            {order.returnDate ? getTimeLabel(order.returnDate) : undefined}
          </DisableableTypography>
        </StyledGridItem>
        </StyledDetailsGrid>
        <StyledDetailsGrid container>
        <StyledGridItem item xs={6}>
          <Typography variant='body2' sx={{ fontWeight: 'bold', color: theme.palette.text.unselected }}>
            Collection location
          </Typography>
          <DisableableTypography>
            {facilities.find(c => c.facilityId === order?.pickupLocation)?.name}
          </DisableableTypography>
        </StyledGridItem>
        <StyledGridItem item xs={6}>
          <Typography variant='body2' sx={{ fontWeight: 'bold', color: theme.palette.text.unselected }}>
            Return location
          </Typography>
          <DisableableTypography>
            {facilities.find(c => c.facilityId === order?.dropoffLocation)?.name}
          </DisableableTypography>
        </StyledGridItem>
        </StyledDetailsGrid>
      </StyledSectionBox>
      <StyledSectionBox sx={{ marginTop: theme.spacing(3) }}>
        <Typography variant='subtitle2'>Allocated containers</Typography>
        <StyledDivider/>
        <Box display='flex' flexDirection='row' gap={1}>
          {
            allocatableContainersIds && allocatableContainersIds.length > 0 &&
            allocatableContainersIds.map((c, i) => (
              <Typography key={i}>
                {allocatableContainersIds.length > 1 && i !== allocatableContainersIds.length - 1 ? `${c},` : c}
              </Typography>
            ))
          }
        </Box>
      </StyledSectionBox>
    </Box>
  )
}

export default SummaryForm
