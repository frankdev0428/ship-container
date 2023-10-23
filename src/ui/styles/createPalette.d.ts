import '@mui/material/styles'
import '@mui/material/Typography'

declare module '@mui/material/styles' {
  interface Palette {
    disabled: Palette['primary'];
  }
  interface PaletteOptions {
    disabled: PaletteOptions['primary'];
  }

  interface PaletteColor {
    highlight?: string;
  }
  interface SimplePaletteColorOptions {
    highlight?: string;
  }

  interface TypeText {
    unselected?: string;
  }

  interface TypographyStyleOptions extends React.CSSProperties {
    fontFamilyBold?: string;
    fontFamilyLight?: string;
    fontFamilyExtralight?: string;
  }
  interface TypographyVariants {
    label: TypographyStyleOptions;
    specialTag: TypographyStyleOptions;
    specialError: TypographyStyleOptions;
    specialHelper: TypographyStyleOptions;
  }
  interface TypographyVariantsOptions {
    label?: TypographyStyleOptions;
    specialTag?: TypographyStyleOptions;
    specialError?: TypographyStyleOptions;
    specialHelper?: TypographyStyleOptions;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    label: true;
    specialTag: true;
    specialError: true;
    specialHelper: true;
  }
}
