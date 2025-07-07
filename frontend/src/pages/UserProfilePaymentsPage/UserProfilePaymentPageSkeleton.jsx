import Skeleton from '@mui/material/Skeleton';

export default function UserProfilePaymentPageSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      width={1066}
      height={239}
      style={{ borderRadius: 'var(--border-radius-medium)' }}
      animation="wave"
    />
  );
}
