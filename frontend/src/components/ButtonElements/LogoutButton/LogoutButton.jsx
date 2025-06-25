import { useDispatch } from 'react-redux';
import { FiLogOut } from 'react-icons/fi';

import { logOut } from '../../../redux/auth/operations';

import css from './LogoutButton.module.css';

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <button className={css.btn} onClick={handleLogout}>
      <FiLogOut className={css.icon} />
      Вийти з профілю
    </button>
  );
}
