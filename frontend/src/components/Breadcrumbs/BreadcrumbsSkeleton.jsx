import Skeleton from '@mui/material/Skeleton';

export default function BreadcrumbsSkeleton() {
  return (
    <Skeleton
      variant="text"
      width={320}
      height={28}
      animation="wave"
      style={{ marginBottom: '20px', borderRadius: 'var(--border-radius)' }}
    />
  );
}
