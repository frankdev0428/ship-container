// Theming stategy from: https://github.com/react-theming/storybook-addon
import { createTheme } from '@mui/material/styles'

import ManropeLight_ from './fonts/Manrope-Light.ttf'
import ManropeRegular_ from './fonts/Manrope-Regular.ttf'
import ManropeMedium_ from './fonts/Manrope-Medium.ttf'
import ManropeBold_ from './fonts/Manrope-Bold.ttf'

// Import all theme values here
const colors = {
  '--B900-Brand': '#3a5896',
  '--B900-Dark': '#003068',
  '--B900-Light': '#6c85c7',
  '--B900-Highlight': '#1674D0',
  '--B500-Temperature': '#55abf3',
  '--N900-text': '#2b303a',
  '--N500-unselected': '#68748d',
  '--N150-disabled': '#c4c9d4',
  '--N75': '#e1e3e9',
  '--N30-table_bg': '#f4f5f8',
  '--N30': '#f4f5f8',
  '--N15': '#f9f9fb',
  '--N0-white': '#ffffff',
  '--S400-Secondary': '#e7e247',
  '--S400-Dark': '#b2b000',
  '--CC-High_risk-dark': '#9e0d0a',
  '--CC-High_risk': '#d64933',
  '--CC-Risk-dark': '#c56b00',
  '--CC-Risk': '#fa8e1e',
  '--CC-No_Risk': '#698d3c',
}

// const ManropeLight = {
//   fontFamily: 'Manrope-Light_',
//   fontStyle: 'normal',
//   fontWeight: 200,
//   src: `url(${ManropeLight_})`,
// }

// const ManropeRegular = {
//   fontFamily: 'Manrope-Regular_',
//   fontStyle: 'normal',
//   fontWeight: 200,
//   src: `url(${ManropeRegular_})`,
// }

// const ManropeMedium = {
//   fontFamily: 'Manrope-Medium_',
//   fontStyle: 'normal',
//   fontWeight: 200,
//   src: `url(${ManropeMedium_})`,
// }

// const ManropeBold = {
//   fontFamily: 'Manrope-Bold_',
//   fontStyle: 'normal',
//   fontWeight: 200,
//   src: `url(${ManropeBold_})`,
// }

// build theme from colors and root modules
// TODO: Add a proper type to theme, right now it's used as any
// https://medium.com/javascript-in-plain-english/extend-material-ui-theme-in-typescript-a462e207131f

const defaultFontFamily = ['"Roboto"', '"Helvetica"', '"Arial"', 'sans-serif']

const secondaryFontFamily = ['"Lato", "Ubuntu"', ...defaultFontFamily].join(', ')

const theme = createTheme({
  typography: {
    fontFamily: secondaryFontFamily,
    h1: {
      fontFamily: 'Manrope-Light_',
      fontWeight: 200,
      fontSize: 94,
      letterSpacing: 1.5,
    },
    h2: {
      fontFamily: 'Manrope-Light_',
      fontWeight: 200,
      fontSize: 59,
      letterSpacing: 0.5,
    },
    h3: {
      fontFamily: 'Manrope-Regular_',
      fontWeight: 200,
      fontSize: 47,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: 'Manrope-Regular_',
      fontWeight: 200,
      fontSize: 33,
      letterSpacing: 0.25,
    },
    h5: {
      fontFamily: 'Manrope-Regular_',
      fontFamilyBold: 'Manrope-Bold_',
      fontWeight: 200,
      fontSize: 24,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: 'Manrope-Medium_',
      fontWeight: 200,
      fontSize: 20,
      letterSpacing: 0.15,
    },
    subtitle1: {
      fontFamily: 'Manrope-Regular_',
      fontWeight: 200,
      fontSize: 16,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontFamily: 'Manrope-Regular_',
      fontWeight: 200,
      fontSize: 14,
      letterSpacing: 0.1,
    },
    body1: {
      fontWeight: 400,
      fontSize: 17,
      letterSpacing: 0.5,
    },
    body2: {
      /* 
      *   IMPORTANT!!!
      *   CSSBaseline will override the document's body font-family with body2 fontFamily.
      *   If the body2 font is not found, or if there is a typo, it will default to the browser's default font.
      *   In order to change body2 fontFamily, we should add it to MUI default fonts as the first occurence; this way, if not found
      *   it will default to one of MUI's default fonts
      */
      // fontFamily: secondaryFontFamily,
      fontWeight: 400,
      fontSize: 15,
      letterSpacing: 0.25,
    },
    caption: {
      fontSize: 13,
      letterSpacing: 0.4,
      fontWeight: 400,
    },
    button: {
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: 1.25,
    },
    overline: {
      fontSize: 10,
      letterSpacing: 1.5,
      fontWeight: 400,
      textTransform: 'uppercase' as React.CSSProperties['textTransform'],
    },
    label: {
      fontSize: 13,
      letterSpacing: 0.4,
      fontWeight: 400,
    },
    specialTag: {
      fontWeight: 400,
      fontSize: 10,
      letterSpacing: 0.31,
      textTransform: 'uppercase' as React.CSSProperties['textTransform'],
      color: colors['--B900-Brand'],
    },
    specialError: {
      fontWeight: 400,
      fontSize: 11,
      letterSpacing: 0.08,
      color: colors['--CC-High_risk-dark'],
    },
    specialHelper: {
      fontWeight: 400,
      fontSize: 11,
      letterSpacing: 0.08,
      color: colors['--N500-unselected'],
    },
  },
  palette: {
    primary: {
      main: colors['--B900-Brand'],
      light: colors['--B900-Light'],
      dark: colors['--B900-Dark'],
      contrastText: colors['--N0-white'],
      highlight: colors['--B900-Highlight'],
    },
    secondary: {
      main: colors['--S400-Secondary'],
      dark: colors['--S400-Dark'],
    },
    text: {
      primary: colors['--N900-text'],
      secondary: colors['--N500-unselected'],
      unselected: colors['--N500-unselected'],
    },
    info: {
      main: colors['--N75'],
      light: colors['--N30'],
    },
    disabled: {
      main: colors['--N150-disabled'],
    },
    warning: {
      main: colors['--CC-Risk'],
      dark: colors['--CC-Risk-dark'],
    },
    error: {
      main: colors['--CC-High_risk'],
      dark: colors['--CC-High_risk-dark'],
    },
    success: {
      main: colors['--CC-No_Risk'],
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Manrope-Light_';
          font-style: normal;
          font-weight: 200;
          src: url(${ManropeLight_}) format("truetype");
        }
        @font-face {
          font-family: 'Manrope-Regular_';
          font-style: normal;
          font-weight: 200;
          src: url(${ManropeRegular_}) format("truetype");
        }
        @font-face {
          font-family: 'Manrope-Medium_';
          font-style: normal;
          font-weight: 200;
          src: url(${ManropeMedium_}) format("truetype");
        }
        @font-face {
          font-family: 'Manrope-Bold_';
          font-style: normal;
          font-weight: 200;
          src: url(${ManropeBold_}) format("truetype");
        }

        html {
          *::-webkit-scrollbar {
            width: 0.6em;
          }
          *::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.2);
          }
          *::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,0.12);
          }
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        outlinedPrimary: {
          border: `1px solid ${colors['--B900-Brand']}`,
        },
      },
    },
  },
})

export default theme
