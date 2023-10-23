import { Chip, styled } from '@mui/material'
import React from 'react'

import Typography from '../Utils/Typography'

const CustomizedChip = styled(Chip)({
  // border: 'none',
  // height: 24,

  // backgroundColor: '#EBF0F8',
  // height: 'auto',
  // color: '#3A5896',

  backgroundColor: '#3a58961a', border: 'none', height: '24px',

})

interface StyledChipProps {
  chipLabel: string;
  onDelete: (e: any) => void;
}

const StyledChip = ({ chipLabel, onDelete }: StyledChipProps): JSX.Element => {
  return (
    <CustomizedChip
      onDelete={onDelete}

      color='primary'
      variant='outlined'
      label={<Typography variant='label' sx={{ textTransform: 'none' }}>{chipLabel}</Typography>}
    />
  )
}

export default StyledChip
