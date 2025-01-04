import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Mulish", sans-serif',
    fontWeightExtraBold: 800,
    fontWeightBold: 700,
    fontWeightMedium: 600,
    fontWeightNormal: 400,
    fontWeightSmall: 300,
  },
  custom: {
    colors: {
      defaultWhite: '#FFFFFF',
      greyExtraLight: '#c8c8c8',
      greyLightest: 'rgba(255, 255, 255, 0.8)',
      greyLight: '#E8E8E8',
      greyLighter: '#D2D2D2',
      greyDark: '#B1B1B1',
      greyDarker: '#949494',
      greyDarkest: '#414141',
      defaultBlack: '#0C0600',

      primaryYellow: '#FCBC5A',
      primaryYellowLight: 'rgba(252, 188, 90, 0.32)',
      primaryYellowLighter: '#FFD99F',
      primaryDarkOrange: '#DA5135',

      secondaryDarkYellow: '#FBAB30',
      secondaryPeach: '#F67B52',
      secondaryPink: '#D88B99',
      secondaryDarkBlue: '#085E69',
      faceBook: '#0062e0',
      secondaryGreen: '#5D8348',

      errorLightRed: 'rgba(211, 50, 50, 0.70)',
      errorRed: '#D33232',

      warningLightOrange: 'rgba(219, 106, 49, 0.70)',
      warningOrange: '#E77034',

      successLightGreen: '#D0DCA6',
      successGreen: '#5D8348',

      backgroundColor: '#FEFCFA',
      backgroundCart: 'F5F5F5',
      backgroundGrey: '#D9D9D9',
      backgroundPale: '#FFEBCC',
      backgroundBackdrop: 'rgba(0, 0, 0, 0.7)',
      backgroundSmallBackdrop: 'rgba(0, 0, 0, 0.5)',
      backgroundModal: '#fffdf9',
    },
    sizes: {
      fontSizeBiggest: '200px',
      fontSizeLarge: '44px',
      fontSizeLargeMedium: '32px',
      fontSizeMedium: '24px',
      fontSizeMediumSmall: '20px',
      fontSizeSmall: '18px',
      fontSizeExtraSmall: '16px',
      fontSizeTiny: '14px',
      fontSizeExtraTiny: '12px',

      borderRadiusAvatar: '80px',
      borderRadiusMedium: '16px',
      borderRadius: '8px',
      borderRadiusSmall: '4px',

      iconSizeLarge: '32px',
      iconSizeNormal: '24px',
      iconSizeMedium: '22px',
      checkboxSize: '20px',
      iconSize: '16px',
    },
    borders: {
      borderStyle: 'solid',
      borderWidthBiggest: '8px',
      borderWidthBig: '2px',
      borderWidthBigger: '1.2px',
      borderWidth: '1px',
      borderWidthSmall: '0.5px',
    },
    shadows: {
      cartShadow: '0px 1px 12px 0px rgba(130, 84, 8, 0.15)',
    },
    dimensions: {
      componentHeight: '44px',
    },
  },
});

export default theme;
