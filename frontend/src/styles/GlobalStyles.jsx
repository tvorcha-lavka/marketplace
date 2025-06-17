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
          lineHeight: 1.255,
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

        '.container': {
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 120px',
        },

        '.section': {
          padding: '20px 0 114px 0',
        },

        "input[type='password']::-ms-reveal": {
          display: 'none',
        },

        "input[type='password']::-ms-clear": {
          display: 'none',
        },

        '::-webkit-scrollbar': {
          width: '8px',
        },

        '::-webkit-scrollbar-thumb': {
          backgroundColor: 'var(--primary-yellow)',
          borderRadius: 'var(--border-radius-smallest)',
        },

        '::-webkit-scrollbar-track': {
          backgroundColor: 'var(--primary-yellow-light)',
        },

        '.scrollBox': {
					overflowY: 'auto',
					overflowX: 'hidden',
        },

        '.scrollBoxInner': {
          height: 'auto',
        },

        ':root': {
          '--default-white': theme.custom.colors.defaultWhite, //fff
          '--white': theme.custom.colors.white, //#f7f4ef
          '--grey-extra-light': theme.custom.colors.greyExtraLight, //#c8c8c8
          '--grey-lightest': theme.custom.colors.greyLightest, //rgba(255, 255, 255, 0.8);
          '--grey-light': theme.custom.colors.greyLight, //E8E8E8
          '--grey': theme.custom.colors.grey, //EEEEEE
          '--grey-lighter': theme.custom.colors.greyLighter, //D2D2D2
          '--grey-dark': theme.custom.colors.greyDark, //B1B1B1
          '--grey-darker': theme.custom.colors.greyDarker, //949494
          '--grey-medium-dark': theme.custom.colors.greyMediumDark, //474747
          '--grey-medium': theme.custom.colors.greyMedium, //#4b4c4b
          '--grey-darkest': theme.custom.colors.greyDarkest, //414141
          '--default-black': theme.custom.colors.defaultBlack, //0C0600
          '--black': theme.custom.colors.black, //111111

          '--primary-yellow': theme.custom.colors.primaryYellow, //FCBC5A
          '--primary-yellow-light': theme.custom.colors.primaryYellowLight, //rgba(252, 188, 90, 0.32)
          '--primary-light': theme.custom.colors.primaryLight, //rgba(130, 84, 8, 0.1);
          '--primary-yellow-lighter': theme.custom.colors.primaryYellowLighter, //FFD99F
          '--primary-dark-orange': theme.custom.colors.primaryDarkOrange, //DA5135

          '--secondary-dark-yellow': theme.custom.colors.secondaryDarkYellow, //FBAB30
          '--secondary-peach': theme.custom.colors.secondaryPeach, //F67B52
          '--secondary-pink': theme.custom.colors.secondaryPink, //D88B99
          '--secondary-dark-blue': theme.custom.colors.secondaryDarkBlue, //085E69
          '--facebook-blue': theme.custom.colors.faceBook, //#0062e0
          '--secondary-green': theme.custom.colors.secondaryGreen, //5D8348

          '--error-light-red': theme.custom.colors.errorLightRed, //rgba(211, 50, 50, 0.70)
          '--error-red': theme.custom.colors.errorRed, //D33232
          '--medium-pink': theme.custom.colors.mediumPink, //rgb(243, 178, 229);
          '--pink': theme.custom.colors.pink, //#fad7d7

          '--warning-light-orange': theme.custom.colors.warningLightOrange, //rgba(219, 106, 49, 0.70)
          '--warning-orange': theme.custom.colors.warningOrange, //E77034

          '--success-light-green': theme.custom.colors.successLightGreen, //D0DCA6
          '--success-green': theme.custom.colors.successGreen, //5D8348

          '--background-color': theme.custom.colors.backgroundColor, //FEFCFA
          '--background-cart': theme.custom.colors.backgroundCart, //F5F5F5
          '--background-grey': theme.custom.colors.backgroundGrey, //D9D9D9
          '--background-pale': theme.custom.colors.backgroundPale, //FFEBCC
          '--background-backdrop': theme.custom.colors.backgroundBackdrop, //rgba(0, 0, 0, 0.7);
          '--background-small-backdrop':
            theme.custom.colors.backgroundSmallBackdrop, //rgba(0, 0, 0, 0.5);
          '--background-modal': theme.custom.colors.backgroundModal, //#fffdf9
          '--dote-border-color': theme.custom.colors.doteBorderColor, //rgba(0, 0, 0, 0.1)

          '--font-family': theme.typography.fontFamily,
          '--font-weight-extra-bold': theme.typography.fontWeightExtraBold, //800
          '--font-weight-bold': theme.typography.fontWeightBold, //700
          '--font-weight-medium': theme.typography.fontWeightMedium, //600
          '--font-weight-normal': theme.typography.fontWeightNormal, //400
          '--font-weight-small': theme.typography.fontWeightSmall, //300

          '--font-size-biggest': theme.custom.sizes.fontSizeBiggest, //200
          '--font-size-extra-big': theme.custom.sizes.fontSizeExtraBig, //56
          '--font-size-large': theme.custom.sizes.fontSizeLarge, //44
          '--font-size-large-medium': theme.custom.sizes.fontSizeLargeMedium, //32
          '--font-size-medium': theme.custom.sizes.fontSizeMedium, //24
          '--font-size-medium-small': theme.custom.sizes.fontSizeMediumSmall, //20
          '--font-size-small': theme.custom.sizes.fontSizeSmall, //18
          '--font-size-extra-small': theme.custom.sizes.fontSizeExtraSmall, //16
          '--font-size-tiny': theme.custom.sizes.fontSizeTiny, //14
          '--font-size-extra-tiny': theme.custom.sizes.fontSizeExtraTiny, //12

          '--border-radius-circle': theme.custom.sizes.borderRadiusCircle, //50%
          '--border-radius-avatar': theme.custom.sizes.borderRadiusAvatar, //80
          '--border-radius-category': theme.custom.sizes.borderRadiusCategory, //40
          '--border-radius-medium': theme.custom.sizes.borderRadiusMedium, //16
          '--border-radius-medium-less':
            theme.custom.sizes.borderRadiusMediumLess, //12
          '--border-radius': theme.custom.sizes.borderRadius, //8
          '--border-radius-smaller': theme.custom.sizes.borderRadiusSmaller, //5
          '--border-radius-small': theme.custom.sizes.borderRadiusSmall, //4
          '--border-radius-smallest': theme.custom.sizes.borderRadiusSmallest, //1

          '--icon-size-large': theme.custom.sizes.iconSizeLarge, //32
          '--icon-size-normal': theme.custom.sizes.iconSizeNormal, //24
          '--icon-size-medium': theme.custom.sizes.iconSizeMedium, //22
          '--checkbox-size': theme.custom.sizes.checkboxSize, //20
          '--icon-size': theme.custom.sizes.iconSize, //16

          '--border-style': theme.custom.borders.borderStyle, //solid
          '--border-extra-big': theme.custom.borders.borderExtraBig, //10px
          '--border-width-biggest': theme.custom.borders.borderWidthBiggest, //8px
          '--bord-width-biggest': theme.custom.borders.bordWidthBiggest, //7px
          '--border-width-big': theme.custom.borders.borderWidthBig, //2px
          '--bord-width-bigger': theme.custom.borders.bordWidthBigger, //1.4px
          '--border-width-bigger': theme.custom.borders.borderWidthBigger, //1.2px
          '--border-width': theme.custom.borders.borderWidth, //1px
          '--border-width-small': theme.custom.borders.borderWidthSmall, //0.5px

          '--cart-shadow': theme.custom.shadows.cartShadow, //0px 1px 12px 0px rgba(130, 84, 8, 0.15)
          '--modal-shadow': theme.custom.shadows.modalShadow, //0px 1px 8px 0px rgba(130, 84, 8, 0.102);
          '--shadow': theme.custom.shadows.shadow, //5px 5px 10px rgb(119, 119, 119)
          '--shadow-color': theme.custom.shadows.shadowColor, //2px 2px 8px rgba(112, 92, 2, 0.7)
        },
      }}
    />
  );
};

export default GlobalStylesComponent;
