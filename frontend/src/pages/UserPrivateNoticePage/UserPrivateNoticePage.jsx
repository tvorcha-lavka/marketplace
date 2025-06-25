import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserPrivateNoticePage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/coming-soon');
  }, [navigate]);

  return null;
}
