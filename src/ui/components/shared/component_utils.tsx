import React, { ReactElement } from 'react'
import { CircularProgress, Box, BoxProps } from '@mui/material'

import Typography, { ExtendedVariantTypographyProps } from '../Utils/Typography'

interface CenteredContentProps extends BoxProps {
  children: ReactElement;
}

export function CenteredContent({ children, ...restProps }: CenteredContentProps) {
  return (
    <Box display='flex' flexDirection='column' flexGrow={1} alignItems='center' justifyContent='center' {...restProps} >
      {children}
    </Box>
  )
}

interface LoadingProps {
  loading: boolean;
  children: ReactElement;
}

export const Loading = ({ loading, children }: LoadingProps) => (loading
  ? <CenteredContent><CircularProgress /></CenteredContent>
  : children || null
)

interface SelectableTypographyProps extends ExtendedVariantTypographyProps {
  selected?: boolean;
}

export const SelectableTypography = React.forwardRef<HTMLElement, SelectableTypographyProps>(function SelectableTypography(props, ref) {
  const { selected, children, ...restProps } = props
  return (<Typography
    ref={ref}
    {...restProps}
    style={{
      ...restProps.style,
      fontWeight: selected ? 'bold' : undefined,
      textDecoration: selected ? 'underline' : undefined,
    }}
  >
    {children}
  </Typography>)
})
SelectableTypography.displayName = 'SelectableTypography'
