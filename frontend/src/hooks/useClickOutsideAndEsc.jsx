import { useEffect, useRef } from 'react';

export const useClickOutsideAndEsc = (closeModal) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [closeModal]);

  return modalRef;
};
