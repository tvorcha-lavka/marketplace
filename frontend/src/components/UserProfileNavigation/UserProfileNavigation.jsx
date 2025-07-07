import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import UserProfileNavigationSkeleton from './UserProfileNavigationSkeleton';

import useDelayedLoading from '../../hooks/useDelayedLoading';

import css from './UserProfileNavigation.module.css';

export default function UserProfileNavigation() {
  function getClassActiveLink({ isActive }) {
    return clsx(css.link, isActive && css.active);
  }

  const delayedLoading = useDelayedLoading();
  if (delayedLoading) {
    return <UserProfileNavigationSkeleton />;
  }

  return (
    <nav className={css.navigation}>
      <ul className={css.menuList}>
        <li className={css.list}>
          <NavLink
            className={getClassActiveLink}
            to={'/profile-settings/profile-info'}
          >
            <p className={css.listText}>Основна інформація</p>
          </NavLink>
        </li>
        <li className={css.list}>
          <NavLink
            className={getClassActiveLink}
            to={'/profile-settings/profile-payment'}
          >
            <p className={css.listText}>Платежі і карти</p>
          </NavLink>
        </li>
        <li className={css.list}>
          <NavLink
            className={getClassActiveLink}
            to={'/profile-settings/profile-delivery'}
          >
            <p className={css.listText}>Доставка</p>
          </NavLink>
        </li>
        <li className={css.list}>
          <NavLink
            className={getClassActiveLink}
            to={'/coming-soon'} //'/profile-settings/profile-notice'
          >
            <p className={css.listText}>Налаштування сповіщень</p>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
