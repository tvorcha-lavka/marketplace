import Skeleton from '@mui/material/Skeleton';

import css from './AddAdvert.module.css';

export default function AddAdvertSkeleton() {
  return (
    <div>
      <Skeleton
        variant="text"
        width={300}
        height={40}
        style={{
          marginBottom: 16,
          borderRadius: 'var(--border-radius)',
        }}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={1200}
        height={108}
        style={{
          marginBottom: 16,
          borderRadius: 'var(--border-radius-medium)',
        }}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={1200}
        height={265}
        style={{
          marginBottom: 16,
          borderRadius: 'var(--border-radius-medium)',
        }}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={1200}
        height={592}
        style={{
          marginBottom: 16,
          borderRadius: 'var(--border-radius-medium)',
        }}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={1200}
        height={238}
        style={{
          marginBottom: 16,
          borderRadius: 'var(--border-radius-medium)',
        }}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={1200}
        height={228}
        style={{
          marginBottom: 16,
          borderRadius: 'var(--border-radius-medium)',
        }}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={1200}
        height={175}
        style={{
          marginBottom: 16,
          borderRadius: 'var(--border-radius-medium)',
        }}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={1200}
        height={244}
        style={{
          marginBottom: 16,
          borderRadius: 'var(--border-radius-medium)',
        }}
        animation="wave"
      />
      <div className={css.btnWrapper}>
        <Skeleton
          variant="rectangular"
          width={213}
          height={44}
          style={{ borderRadius: 'var(--border-radius)' }}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          width={232}
          height={44}
          style={{ borderRadius: 'var(--border-radius)' }}
          animation="wave"
        />
      </div>
    </div>
  );
}
