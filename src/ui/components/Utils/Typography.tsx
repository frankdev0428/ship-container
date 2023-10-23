import React from 'react'
import { SxProps, Theme, useTheme } from '@mui/material/styles'
import { Typography as MuiTypography, TypographyProps, TypographyVariant } from '@mui/material'

const getStyles = (theme: Theme): Record<string, SxProps> => ({
  label: {
    fontFamily: 'Lato',
    fontSize: 13,
    letterSpacing: 0.4,
    fontWeight: 400,
  },
  specialTag: {
    fontFamily: 'Lato',
    fontWeight: 400,
    fontSize: 10,
    letterSpacing: 0.31,
    textTransform: 'uppercase',
    color: theme.palette.primary.main,
  },
  specialError: {
    fontFamily: 'Lato',
    fontWeight: 400,
    fontSize: 11,
    letterSpacing: 0.08,
    color: theme.palette.error.dark,
  },
  specialHelper: {
    fontFamily: 'Lato',
    fontWeight: 400,
    fontSize: 11,
    letterSpacing: 0.08,
    color: theme.palette.text.unselected,
  },
})

export const DisableableTypography = React.forwardRef<HTMLElement, ExtendedVariantTypographyProps>(function DisableableTypography({ children, ...rest }, ref) {
  return <Typography ref={ref} disabled={!children} {...rest}>{children === 0 ? children : (children || 'N/A')}</Typography>
})
DisableableTypography.displayName = 'DisableableTypography'

export type NewTypoVariants = 'label' | 'specialTag' | 'specialError' | 'specialHelper'

export type TypoVariants = TypographyVariant | NewTypoVariants

type TypoWithoutVariant = Omit<TypographyProps, 'variant'>

export interface ExtendedVariantTypographyProps extends TypoWithoutVariant {
  variant?: TypoVariants;
  bold?: boolean;
  disabled?: boolean;
  component?: any;
  to?: string;
}

/**
 * Overrides default material UI typography with some additional variants
 */
const Typography = React.forwardRef<HTMLElement, ExtendedVariantTypographyProps>(function Typography({ variant, bold, disabled, sx, ...restProps }, ref) {
  const theme = useTheme()
  const styles = getStyles(theme)
  const isCustom = !!variant && Object.keys(styles).indexOf(variant) > -1

  return (
    <MuiTypography
      ref={ref}
      variant={isCustom ? undefined : variant as TypoVariants}
      sx={[
        isCustom && styles[variant as NewTypoVariants],
        bold && { fontFamily: theme.typography[(variant || 'h6') as TypoVariants].fontFamilyBold },
        disabled && { color: theme.palette.disabled?.main },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...restProps}
    />
  )
})
Typography.displayName = 'Typography'
export default Typography
