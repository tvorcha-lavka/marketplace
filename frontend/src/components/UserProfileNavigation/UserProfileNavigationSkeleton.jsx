import Skeleton from '@mui/material/Skeleton';

import css from './UserProfileNavigation.module.css';

export default function UserProfileNavigationSkeleton() {
  return (
    <nav className={css.navigation}>
      <ul className={css.menuList}>
        {[...Array(4)].map((_, i) => (
          <li key={i} className={css.list}>
            <Skeleton
              variant="rectangular"
              width={215}
              height={44}
              animation="wave"
              style={{
                borderRadius: 'var(--border-radius)',
              }}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
