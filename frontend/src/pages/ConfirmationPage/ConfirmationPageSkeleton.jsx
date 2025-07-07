import Skeleton from '@mui/material/Skeleton';

export default function ConfirmationPageSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      width={1200}
      height={281}
      animation="wave"
      style={{ borderRadius: 'var(--border-radius-medium)' }}
    />
  );
}
