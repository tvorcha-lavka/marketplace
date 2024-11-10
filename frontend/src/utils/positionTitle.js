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
