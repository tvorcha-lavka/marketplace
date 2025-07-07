import Skeleton from '@mui/material/Skeleton';

import css from './Question.module.css';

export default function QuestionSkeleton() {
  return (
    <section className="container">
      <div className={css.section}>
        <Skeleton
          variant="text"
          width={550}
          height={40}
          animation="wave"
          className={css.title}
          style={{ marginBottom: '32px', borderRadius: 'var(--border-radius)' }}
        />

        <div className={css.contentbox}>
          <Skeleton
            variant="rectangular"
            width={591}
            height={406}
            animation="wave"
            className={css.image}
            style={{ borderRadius: 'var(--border-radius-medium)' }}
          />

          <ul className={css.accordion}>
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} style={{ marginBottom: '16px' }}>
                <Skeleton
                  variant="rounded"
                  width={594}
                  height={70}
                  animation="wave"
                  style={{ borderRadius: 'var(--border-radius-medium)' }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
