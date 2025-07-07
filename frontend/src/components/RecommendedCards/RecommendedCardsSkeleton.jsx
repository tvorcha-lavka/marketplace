import Skeleton from '@mui/material/Skeleton';

import css from './RecommendedCards.module.css';

export default function RecommendedCardsSkeleton() {
  return (
    <div>
      <Skeleton
        variant="text"
        width={450}
        height={40}
        animation="wave"
        style={{ marginBottom: '32px', borderRadius: 'var(--border-radius)' }}
      />
      <ul className={css.list}>
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className={css.itemLoader}>
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
  );
}
