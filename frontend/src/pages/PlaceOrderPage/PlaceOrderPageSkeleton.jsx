import Skeleton from '@mui/material/Skeleton';

export default function PlaceOrderPageSkeleton() {
  return (
    <>
      <Skeleton
        variant="rectangular"
        width={694}
        height={71}
        style={{ borderRadius: 'var(--border-radius-medium)' }}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={694}
        height={71}
        style={{ borderRadius: 'var(--border-radius-medium)' }}
        animation="wave"
      />
    </>
  );
}
