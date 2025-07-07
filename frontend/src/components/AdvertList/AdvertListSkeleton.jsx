import Skeleton from '@mui/material/Skeleton';

import css from './AdvertList.module.css';

export default function AdvertListSkeleton() {
  return (
    <section className="container">
      <div className={css.section}>
        <Skeleton
          variant="text"
          width={240}
          height={40}
          animation="wave"
          style={{ marginBottom: '32px', borderRadius: 'var(--border-radius)' }}
        />
        <ul className={css.list}>
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={288}
                animation="wave"
                style={{ borderRadius: 'var(--border-radius-medium)' }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
