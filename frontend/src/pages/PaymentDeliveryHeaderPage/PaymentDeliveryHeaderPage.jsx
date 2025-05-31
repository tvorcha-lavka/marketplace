import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import css from './PaymentDeliveryHeaderPage.module.css';

export default function PaymentDeliveryHeaderPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/coming-soon');
  }, [navigate]);

  return null;
}
