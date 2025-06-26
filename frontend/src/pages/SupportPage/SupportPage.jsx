import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//import css from './SupportPage.module.css';

export default function SupportPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/coming-soon');
  }, [navigate]);

  return null;
}
