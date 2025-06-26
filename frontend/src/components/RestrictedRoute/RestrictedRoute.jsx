import { Navigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectLoggedIn } from '../../redux/auth/selectors';

export default function RestrictedRoute({
  component: Component,
  redirectTo = '/',
}) {
  const isLoggedIn = useSelector(selectLoggedIn);

  return isLoggedIn ? <Navigate to={redirectTo} /> : Component;
}
