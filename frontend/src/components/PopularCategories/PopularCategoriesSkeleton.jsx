import Skeleton from '@mui/material/Skeleton';

import css from './PopularCategories.module.css';

export default function PopularCategoriesSkeleton() {
  return (
    <section className="container">
      <div className={css.section}>
        <div className={css.boxLoader}>
          <Skeleton
            variant="text"
            width={240}
            height={40}
            animation="wave"
            style={{ borderRadius: 'var(--border-radius)' }}
          />
          <Skeleton
            variant="text"
            width={100}
            height={20}
            animation="wave"
            style={{ borderRadius: 'var(--border-radius)' }}
          />
        </div>

        <ul className={css.loaderList}>
          {Array.from({ length: 4 }).map((_, i) => (
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
          <li className={css.largeItem}>
            <Skeleton
              variant="rectangular"
              width={390}
              height={480}
              style={{ borderRadius: 'var(--border-radius-medium)' }}
              animation="wave"
            />
          </li>
        </ul>
      </div>
    </section>
  );
}
