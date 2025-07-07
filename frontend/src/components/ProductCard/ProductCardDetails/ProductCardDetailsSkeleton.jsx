import Skeleton from '@mui/material/Skeleton';

import css from './ProductCardDetails.module.css';

export default function ProductCardDetailsSkeleton() {
  return (
    <section>
      <div className={css.container}>
        <div className={css.galleryContainer}>
          <Skeleton
            variant="rectangular"
            width={670}
            height={600}
            animation="wave"
            style={{
              marginBottom: '17px',
              borderRadius: 'var(--border-radius-medium)',
            }}
          />
          <Skeleton
            variant="rectangular"
            width={670}
            height={291}
            animation="wave"
            style={{ borderRadius: 'var(--border-radius-medium)' }}
          />
        </div>

        <div className={css.productDetails}>
          <Skeleton
            variant="rectangular"
            width={490}
            height={386}
            animation="wave"
            style={{ borderRadius: 'var(--border-radius-medium)' }}
          />
          <Skeleton
            variant="rectangular"
            width={490}
            height={197}
            animation="wave"
            style={{ borderRadius: 'var(--border-radius-medium)' }}
          />
          <Skeleton
            variant="rectangular"
            width={490}
            height={123}
            animation="wave"
            style={{ borderRadius: 'var(--border-radius-medium)' }}
          />
          <Skeleton
            variant="rectangular"
            width={490}
            height={150}
            animation="wave"
            style={{ borderRadius: 'var(--border-radius-medium)' }}
          />
        </div>
      </div>
    </section>
  );
}
