import { useState, useEffect } from 'react';

/**
 * @param {boolean} externalLoading - основний стан завантаження з Redux або іншого джерела
 * @param {number} delay - затримка у мілісекундах (за замовчуванням 1000мс)
 * @returns {boolean} - повертає `true`, поки потрібно показувати скелетон
 */

export default function useDelayedLoading(
  externalLoading = false,
  delay = 1000
) {
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    if (!externalLoading) {
      const timer = setTimeout(() => setDelayedLoading(false), delay);
      return () => clearTimeout(timer);
    } else {
      setDelayedLoading(true);
    }
  }, [externalLoading, delay]);

  return delayedLoading;
}
