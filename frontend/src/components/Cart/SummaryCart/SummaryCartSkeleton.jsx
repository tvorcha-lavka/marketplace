import Skeleton from '@mui/material/Skeleton';

import css from './SummaryCart.module.css';

export default function SummaryCartSkeleton() {
  return (
    <div className={css.summarySection}>
      <Skeleton
        variant="rectangular"
        width={490}
        height={332}
        style={{
          borderRadius: 'var(--border-radius-medium)',
        }}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={490}
        height={90}
        style={{
          borderRadius: 'var(--border-radius-medium)',
        }}
        animation="wave"
      />
      <Skeleton
        variant="text"
        width={240}
        height={40}
        animation="wave"
        style={{ borderRadius: 'var(--border-radius)' }}
      />
    </div>
  );
}
