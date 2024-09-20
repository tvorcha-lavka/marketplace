import { GlobalStyles, useTheme } from '@mui/material';

const GlobalStylesComponent = () => {
  const theme = useTheme();

  return (
    <GlobalStyles
      styles={{
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        },
        body: {
          fontFamily: theme.typography.fontFamily,
        },
        'p:last-child': {
          marginBottom: 0,
        },
        'ul, ol': {
          listStyle: 'none',
        },
        a: {
          textDecoration: 'none',
        },
        button: {
          cursor: 'pointer',
          fontFamily: 'inherit',
        },
        img: {
          display: 'block',
          //max-width: '100%',
          height: 'auto',
        },
        ':root': {
          '--default-white': theme.custom.colors.defaultWhite, //fff
          '--grey-light': theme.custom.colors.greyLight, //E8E8E8
          '--grey-lighter': theme.custom.colors.greyLighter, //D2D2D2
          '--grey-dark': theme.custom.colors.greyDark, //B1B1B1
          '--grey-darker': theme.custom.colors.greyDarker, //949494
          '--grey-darkest': theme.custom.colors.greyDarkest, //414141
          '--default-black': theme.custom.colors.defaultBlack, //0C0600

          '--primary-yellow': theme.custom.colors.primaryYellow, //FCBC5A
          '--primary-dark-orange': theme.custom.colors.primaryDarkOrange, //DA5135

          '--secondary-dark-yellow': theme.custom.colors.secondaryDarkYellow, //FBAB30
          '--secondary-peach': theme.custom.colors.secondaryPeach, //F67B52
          '--secondary-pink': theme.custom.colors.secondaryPink, //D88B99
          '--secondary-dark-blue': theme.custom.colors.secondaryDarkBlue, //085E69
          '--facebook-blue': theme.custom.colors.faceBook, //#0062e0
          '--secondary-green': theme.custom.colors.secondaryGreen, //5D8348

          '--error-light-red': theme.custom.colors.errorLightRed, //rgba(211, 50, 50, 0.70)
          '--error-red': theme.custom.colors.errorRed, //D33232

          '--warning-light-orange': theme.custom.colors.warningLightOrange, //rgba(219, 106, 49, 0.70)
          '--warning-orange': theme.custom.colors.warningOrange, //E77034

          '--success-light-green': theme.custom.colors.successLightGreen, //D0DCA6
          '--success-green': theme.custom.colors.successGreen, //5D8348

          '--background-color': theme.custom.colors.backgroundColor, //FEFCFA
          '--background-grey': theme.custom.colors.backgroundGrey, //D9D9D9
          '--background-pale': theme.custom.colors.backgroundPale, //FFEBCC
          '--background-backdrop': theme.custom.colors.backgroundBackdrop,
          '--background-modal': theme.custom.colors.backgroundModal, //#fffdf9

          '--font-weight-bold': theme.typography.fontWeightBold, //700
          '--font-weight-medium': theme.typography.fontWeightMedium, //600
          '--font-weight-normal': theme.typography.fontWeightNormal, //400

          '--font-size-large': theme.custom.sizes.fontSizeLarge, //44
          '--font-size-large-medium': theme.custom.sizes.fontSizeLargeMedium, //32
          '--font-size-medium': theme.custom.sizes.fontSizeMedium, //24
          '--font-size-medium-small': theme.custom.sizes.fontSizeMediumSmall, //20
          '--font-size-small': theme.custom.sizes.fontSizeSmall, //18
          '--font-size-extra-small': theme.custom.sizes.fontSizeExtraSmall, //16
          '--font-size-tiny': theme.custom.sizes.fontSizeTiny, //14
          '--font-size-extra-tiny': theme.custom.sizes.fontSizeExtraTiny, //12

          '--border-radius-medium': theme.custom.sizes.borderRadiusMedium, //16
          '--border-radius': theme.custom.sizes.borderRadius, //8
          '--border-radius-small': theme.custom.sizes.borderRadiusSmall, //4

          '--icon-size-large': theme.custom.sizes.iconSizeLarge, //32
          '--icon-size-normal': theme.custom.sizes.iconSizeNormal, //24
          '--checkbox-size': theme.custom.sizes.checkboxSize, //20
          '--icon-size': theme.custom.sizes.iconSize, //16

          '--border-style': theme.custom.borders.borderStyle, //solid
          '--border-width': theme.custom.borders.borderWidth, //1px

          '--cart-shadow': theme.custom.shadows.cartShadow, //0px 1px 12px 0px rgba(130, 84, 8, 0.15)

          '--component-width': theme.custom.dimensions.componentWidth, //358
          '--component-height': theme.custom.dimensions.componentHeight, //44
        },
      }}
    />
  );
};

export default GlobalStylesComponent;
