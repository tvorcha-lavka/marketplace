import Skeleton from '@mui/material/Skeleton';

import css from './AllCategories.module.css';

export default function AllCategoriesSkeleton() {
  return (
    <>
      <Skeleton
        variant="text"
        width={250}
        height={40}
        style={{ marginBottom: 32, borderRadius: 'var(--border-radius)' }}
        animation="wave"
      />

      <ul className={css.loaderList}>
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i} className={css.loaderItem}>
            <Skeleton
              variant="rectangular"
              width={390}
              height={232}
              style={{ borderRadius: 'var(--border-radius-medium)' }}
              animation="wave"
            />
          </li>
        ))}
        <li className={css.largeItem1}>
          <Skeleton
            variant="rectangular"
            width={390}
            height={480}
            style={{ borderRadius: 'var(--border-radius-medium)' }}
            animation="wave"
          />
        </li>
        <li className={css.largeItem2}>
          <Skeleton
            variant="rectangular"
            width={390}
            height={480}
            style={{ borderRadius: 'var(--border-radius-medium)' }}
            animation="wave"
          />
        </li>
      </ul>
    </>
  );
}
