import Skeleton from '@mui/material/Skeleton';

import css from './NotFoundPage.module.css';

export default function NotFoundPageSkeleton() {
  return (
    <section className="container">
      <div className={css.section}>
        <Skeleton
          variant="rectangular"
          width={1195}
          height={577}
          style={{ borderRadius: 'var(--border-radius-medium)' }}
          animation="wave"
        />
      </div>
    </section>
  );
}
