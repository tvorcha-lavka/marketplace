import { styled } from '@mui/material/styles';

const widths = {
  auto: '100%',
  custom2: '325px',
  semiMedium: '322.5px',
  custom: '289px',
  custom1: '284px',
  custom3: '244px',
  custom4: '232px',
  custom5: '213px',
  small: '187px',
};

const BaseButtonStyled = styled('button')(({ theme }) => ({
  height: '44px',
  padding: '10px',
  justifyContent: 'center',
  alignItems: 'center',
  border: 'none',
  borderRadius: theme.custom.sizes.borderRadius,
  fontSize: theme.custom.sizes.fontSizeExtraSmall,
  fontWeight: theme.typography.fontWeightBold,
  color: theme.custom.colors.defaultBlack,
  outline: `${theme.custom.borders.borderWidth} ${theme.custom.borders.borderStyle} transparent`,
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

export const TransparentButtonStyled = styled(BaseButtonStyled)(
  ({ size, theme }) => ({
    width: widths[size],
    backgroundColor: 'transparent',
    border: `${theme.custom.borders.borderWidth} ${theme.custom.borders.borderStyle} ${theme.custom.colors.defaultBlack}`,

    '&:hover': {
      border: `${theme.custom.borders.borderWidth} ${theme.custom.borders.borderStyle} ${theme.custom.colors.primaryYellow}`,
    },
    '&:focus': {
      border: `${theme.custom.borders.borderWidthBigger} ${theme.custom.borders.borderStyle} ${theme.custom.colors.defaultBlack}`,
    },
  })
);
