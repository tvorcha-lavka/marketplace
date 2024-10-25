import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/auth/operations';
import css from './LogoutButton.module.css';

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <button className={css.logoutBtn} onClick={handleLogout}>
      Logout
    </button>
  );
}
