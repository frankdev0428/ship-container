import React, { useRef, useEffect, useState } from 'react'
import { Tooltip, TooltipProps } from '@mui/material'

interface OverflowTooltipProps extends TooltipProps {
  deps?: any[];
}

const OverflowTooltip = ({ title, children, style, deps, ...restProps }: OverflowTooltipProps) => {
  const [isOverflowed, setIsOverflow] = useState(false)
  const textElementRef = useRef<any>()

  useEffect(() => {
    if (textElementRef) setIsOverflow(textElementRef.current?.scrollWidth > textElementRef.current?.clientWidth)
  }, [textElementRef, ...(deps || [])])

  return (
    <Tooltip
      title={title || ''}
      // interactive
      placement='top'
      disableHoverListener={!isOverflowed}
      {...restProps}
    >
      <div style={{
        overflow: 'hidden',
        display: 'inline-flex',
        width: '100%',
        ...style,
      }}>
        {React.Children.only(React.cloneElement(
          children,
          { ref: (ref: any) => (textElementRef.current = ref) },
        ))}
      </div>
    </Tooltip>
  )
}

export default OverflowTooltip
