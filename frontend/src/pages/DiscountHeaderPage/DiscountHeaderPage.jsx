import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import css from './DiscountHeaderPage.module.css';

export default function DiscountHeaderPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/coming-soon');
  }, [navigate]);

  return null;
}
