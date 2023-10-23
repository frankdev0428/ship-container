import React from 'react'
import { styled } from '@mui/material/styles'

const StyledDot = styled('span')(({ theme }) => ({
  width: 10,
  minWidth: 10,
  height: 10,
  minHeight: 10,
  borderRadius: '50%',
  marginRight: theme.spacing(),
}))

export const ColoredDot = (props: { color?: string }) => {
  return <StyledDot sx={{ backgroundColor: props.color }} />
}
