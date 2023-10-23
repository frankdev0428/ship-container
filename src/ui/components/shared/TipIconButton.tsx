import React from 'react'
import { IconButton, Tooltip, IconButtonProps, TooltipProps } from '@mui/material'

export interface TipIconButtonProps extends IconButtonProps {
  title: string,
  placement?: TooltipProps['placement']
  tooltipProps?: Omit<TooltipProps, 'children' | 'title'>
  component?: any
  to?: any
}

const TipIconButton = ({ title, placement, children, tooltipProps, component, to, ...restProps }: TipIconButtonProps): JSX.Element => {
  return (
    <Tooltip title={title} placement={placement || 'top'} {...tooltipProps}>
      <span >
        <IconButton component={component} size="large" {...restProps} to={to}>
          {children}
        </IconButton>
      </span>
    </Tooltip>
  )
}

export default TipIconButton
