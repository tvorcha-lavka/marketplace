import { styled } from '@mui/material/styles';

const widths = {
  extraLarge: '625px',
  large: '442px',
  medium: '368px',
  small: '187px',
  custom1: '284px',
  custom2: '325px', 
  custom3: '244px',
};

const BaseButtonStyled = styled('button')(({ theme }) => ({
  height: theme.custom.dimensions.componentHeight,
  padding: '10px',
  justifyContent: 'center',
  alignItems: 'center',
  border: 'none',
  borderRadius: theme.custom.sizes.borderRadius,
  fontSize: theme.custom.sizes.fontSizeExtraSmall,
  fontWeight: theme.typography.fontWeightBold,
  color: theme.custom.colors.defaultBlack,
  cursor: 'pointer',
}));

export const ButtonStyled = styled(BaseButtonStyled)(({ size, theme }) => ({
  width: widths[size],
  backgroundColor: theme.custom.colors.primaryYellow,

  '&:hover': {
    backgroundColor: theme.custom.colors.secondaryPeach,
    color: theme.custom.colors.defaultWhite,
  },
  '&:focus': {
    backgroundColor: theme.custom.colors.secondaryDarkBlue,
    color: theme.custom.colors.defaultWhite,
  },

  '&:disabled': {
    backgroundColor: theme.custom.colors.greyLighter,
    color: theme.custom.colors.defaultWhite,
    cursor: 'not-allowed',

    '&:hover': {
      backgroundColor: theme.custom.colors.greyLighter,
      color: theme.custom.colors.defaultWhite,
    },
    '&:focus': {
      backgroundColor: theme.custom.colors.greyLighter,
      color: theme.custom.colors.defaultWhite,
    },
  },
}));

export const TransparentButtonStyled = styled(BaseButtonStyled)(({ size, theme }) => ({
  width: widths[size],
  backgroundColor: 'transparent',
  border: `${theme.custom.borders.borderWidth} ${theme.custom.borders.borderStyle} ${theme.custom.colors.defaultBlack}`,

  '&:hover': {
    border: `${theme.custom.borders.borderWidth} ${theme.custom.borders.borderStyle} ${theme.custom.colors.primaryYellow}`,
  },
  '&:focus': {
    border: `${theme.custom.borders.borderWidthBigger} ${theme.custom.borders.borderStyle} ${theme.custom.colors.defaultBlack}`,
  },
}));
