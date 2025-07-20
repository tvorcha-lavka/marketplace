import { Outlet } from 'react-router-dom';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import UserProfileNavigation from '../UserProfileNavigation/UserProfileNavigation';
import UserProfileSettingSkeleton from './UserProfileSettingSkeleton';

import useDelayedLoading from '../../hooks/useDelayedLoading';

import css from './UserProfileSettings.module.css';

export default function UserProfileSettings() {
  const delayedLoading = useDelayedLoading();

  return (
    <div className={css.wrap}>
      <Breadcrumbs
        links={[
          { label: 'Головна', to: '/', isActive: false },
          { label: 'Профіль', to: '/coming-soon', isActive: false },
          {
            label: 'Налаштування профілю',
            to: '/profile-settings',
            isActive: true,
          },
        ]}
      />

      {delayedLoading ? (
        <UserProfileSettingSkeleton />
      ) : (
        <h2 className={css.title}>Налаштування профілю</h2>
      )}

      <UserProfileNavigation />

      <div>
        <Outlet />
      </div>
    </div>
  );
}
