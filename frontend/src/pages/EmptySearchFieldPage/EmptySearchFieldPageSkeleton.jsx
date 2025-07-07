import Skeleton from '@mui/material/Skeleton';

import css from './EmptySearchFieldPage.module.css';

export default function EmptySearchFieldPageSkeleton() {
  return (
    <div className={css.loaderBox}>
      <Skeleton
        variant="rectangular"
        width={415}
        height={334}
        className={css.image}
        style={{
          marginBottom: '24px',
          borderRadius: 'var(--border-radius-medium)',
        }}
        animation="wave"
      />

      <Skeleton
        variant="text"
        width={260}
        height={40}
        style={{ margin: '0 auto', borderRadius: 'var(--border-radius)' }}
        animation="wave"
      />
      <Skeleton
        variant="text"
        width={480}
        height={40}
        style={{ margin: '0 auto', borderRadius: 'var(--border-radius)' }}
        animation="wave"
      />
    </div>
  );
}
