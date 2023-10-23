import { Link, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from '../../../store'
import { DisableableTypography } from '../Utils/Typography'

import OverflowTooltip from './OverflowTooltip'

interface CustomOverflowValueProps {
  dataKey: string,
  value?: string | number,
  isLink?: boolean,
  to?: string,
  typographyColor?: string
 }

export const CustomOverflowValue = ({ dataKey, value, isLink, to, typographyColor }: CustomOverflowValueProps): JSX.Element => {
  const datagridState = useSelector((state: AppState) => state.ui.datagridState)

  const component = useMemo(() =>
    <OverflowTooltip title={value || ''} deps={[JSON.stringify(datagridState?.[dataKey as string as 'containers'])]}>
      {
        isLink && to
          ? <Typography noWrap variant='body2'>
            <Link href={to}>
              {value}
            </Link>
          </Typography>
          : <DisableableTypography noWrap variant='body2' {...typographyColor && { sx: { color: typographyColor } }}>
            {value}
          </DisableableTypography>
      }
    </OverflowTooltip>,
  [value, typographyColor, to, JSON.stringify(datagridState?.[dataKey as string as 'containers'])])

  return (component)
}
