import { NavLink } from 'react-router-dom';

import LogoutButton from '../ButtonElements/LogoutButton/LogoutButton';

import css from './HeaderUserPopup.module.css';

export default function HeaderUserPopup({ onClose }) {
  return (
    <>
      <ul className={css.navigationMenu}>
        <li className={css.navigationItem}>
          <NavLink>
            <p className={css.navText}>Мої замовлення</p>
          </NavLink>
        </li>
        <li className={css.navigationItem}>
          <NavLink>
            <p className={css.navText}>Мої оголошення</p>
          </NavLink>
        </li>
        <li className={css.navigationItem}>
          <NavLink>
            <p className={css.navText}>Мої продажі</p>
          </NavLink>
        </li>
        <li className={css.navigationItem}>
          <NavLink>
            <p className={css.navText}>Публічний профіль</p>
          </NavLink>
        </li>
        <li className={css.navigationItem}>
          <NavLink>
            <p className={css.navText}>Мої відгуки</p>
          </NavLink>
        </li>
        <li className={css.navigationItem}>
          <NavLink to={'/profile-settings'} onClick={onClose}>
            <p className={`${css.navText} ${css.wrap}`}>Налаштування профілю</p>
          </NavLink>
        </li>

        <li className={css.btnWrap}>
          <LogoutButton />
        </li>
      </ul>
    </>
  );
}
