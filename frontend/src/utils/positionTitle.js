export const positionTitle = (position) => {
  switch (position) {
  case 'top-left':
    return { top: '24px', left: '24px' };
  case 'top-right':
    return { top: '24px', right: '24px' };
  case 'bottom-right':
    return { bottom: '24px', right: '24px' };
  case 'bottom-middle':
    return {
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
    };
  default:
    return {};
  }
};
export const cardOrientation = (orientation, verticalIndex) => {
  if (orientation === 'vertical') {
    switch (verticalIndex) {
    case 0:
      return { gridArea: '1 / 3 / 3 / 3', height: '480px' };
    case 1:
      return { gridArea: '3 / 3/ 5/3', height: '480px' };
    default:
      return {};
    }
  }
  return {};
};
