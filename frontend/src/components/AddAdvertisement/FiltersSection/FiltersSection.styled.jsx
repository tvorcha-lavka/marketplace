import { styled } from '@mui/system';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

export const StyledInputLabel = styled(InputLabel)(() => ({
  display: 'block',
  fontSize: 'var(--font-size-tiny)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--default-black)',
}));

export const StyledSelect = styled(Select, {
  shouldForwardProp: (prop) =>
    prop !== 'hasValue' && prop !== 'hasError' && prop !== 'isOpen',
})(({ hasValue, hasError, isOpen }) => ({
  marginBottom: '7px',
  width: '373px',
  height: '44px',
  paddingLeft: '12px',
  paddingRight: '16px',
  fontSize: 'var(--font-size-tiny)',
  color: hasValue ? 'var(--default-black)' : 'var(--grey-dark)',
  backgroundColor: 'transparent',
  borderRadius: 'var(--border-radius)',
  border: hasError
    ? 'var(--border-width) var(--border-style) var(--error-red)'
    : isOpen
      ? 'var(--border-width) var(--border-style) var(--grey-dark)'
      : hasValue
        ? 'var(--border-width) var(--border-style) var(--default-black)'
        : 'var(--border-width) var(--border-style) var(--grey-dark)',
  marginBlockStart: '4px',
  outline: 'var(--border-width) var(--border-style) transparent',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  cursor: 'pointer',

  '& .MuiSelect-select': {
    padding: 0,
  },

  '&.MuiOutlinedInput-root': {
    marginBottom: 0,
  },

  '&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
}));

export const Options = styled(MenuItem)(() => ({
  backgroundColor: 'var(--default-white)',
  color: 'var(--default-black)',

  '&.MuiButtonBase-root': {
    '&:hover, &:focus, &.Mui-selected': {
      backgroundColor: 'var(--default-white)',
    },
  },
}));

export const menuStyles = {
  PaperProps: {
    sx: {
      marginTop: '7px',
      borderRadius: 'var(--border-radius)',
      padding: '16px',
      width: '373px',
      maxHeight: '172px',
      boxShadow: 'var(--cart-shadow)',
      backgroundColor: 'var(--default-white)',
    },
  },
  MenuListProps: {
    sx: {
      maxHeight: '140px',
      overflowY: 'auto',
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  disableScrollLock: true,
};
