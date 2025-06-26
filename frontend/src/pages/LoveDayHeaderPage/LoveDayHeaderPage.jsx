import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//import css from './LoveDayHeaderPage.module.css';

export default function LoveDayHeaderPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/coming-soon');
  }, [navigate]);

  return null;
}
