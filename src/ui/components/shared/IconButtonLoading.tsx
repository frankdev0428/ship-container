import React from 'react'
import { Box, IconButton, CircularProgress, IconButtonProps, circularProgressClasses, styled } from '@mui/material'

const StyledCircularProgress = styled(CircularProgress)(() => ({
  [`&.${circularProgressClasses.root}`]: {
    position: 'absolute',
  },
}))

interface IconButtonLoadingProps extends IconButtonProps {
  loading?: boolean
}

const IconButtonLoading = ({ loading, size, children, ...restProps }: IconButtonLoadingProps) => {
  let mg = 1
  switch (size) {
    case 'small':
      mg = 0.5
      break
    case 'large':
      mg = 1.5
      break
    default:
  }

  return (
    <span style={{ position: 'relative' }}>
      {loading && <StyledCircularProgress size={24} sx={{ m: mg }}/>}
      <IconButton size={size} {...restProps}>
        {children}
      </IconButton>
    </span>
  )
}

export default IconButtonLoading
