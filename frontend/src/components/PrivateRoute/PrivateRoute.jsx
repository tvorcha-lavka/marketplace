import { Navigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectLoggedIn } from '../../redux/auth/selectors';

export default function PrivateRoute({
  component: Component,
  redirectTo = '/',
}) {
  const isLoggedIn = useSelector(selectLoggedIn);

  return isLoggedIn ? Component : <Navigate to={redirectTo} />;
}
