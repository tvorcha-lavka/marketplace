const POSITION_STYLES = {
  'top-left': { top: '24px', left: '24px' },
  'top-right': { top: '24px', right: '24px' },
  'bottom-right': { bottom: '24px', right: '24px' },
  'bottom-middle': {
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
  },
};

export const positionTitle = (position) => POSITION_STYLES[position] || {};

const VERTICAL_ORIENTATION_STYLES = {
  0: { gridArea: '1 / 3 / 3 / 3', height: '480px' },
  1: { gridArea: '3 / 3/ 5/3', height: '480px' },
};

export const cardOrientation = (orientation, verticalIndex) => {
  if (orientation === 'vertical') {
    return VERTICAL_ORIENTATION_STYLES[verticalIndex] || {};
  }
  return {};
};
