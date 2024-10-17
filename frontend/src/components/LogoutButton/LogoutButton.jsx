import { useDispatch } from 'react-redux';
import { useModal } from '../../hooks/useModal';
import { logOut } from '../../redux/auth/operations';
import css from './LogoutButton.module.css';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const { openModal } = useModal();

  const handleLogout = () => {
    dispatch(logOut(openModal));
  };

  return (
    <button className={css.logoutBtn} onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
