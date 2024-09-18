import { useEffect, useRef } from 'react';

export function useClickOutsideAndEsc(closeModal) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        closeModal();
      }
    }

    function handleEscPress(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscPress);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscPress);
    };
  }, [closeModal]);

  return ref;
}
