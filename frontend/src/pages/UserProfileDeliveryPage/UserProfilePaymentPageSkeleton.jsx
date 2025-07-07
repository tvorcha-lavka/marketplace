import Skeleton from '@mui/material/Skeleton';

export default function UserProfileDeliveryPageSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      width={511}
      height={200}
      style={{ borderRadius: 'var(--border-radius-medium)' }}
      animation="wave"
    />
  );
}
