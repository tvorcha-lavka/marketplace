import Skeleton from '@mui/material/Skeleton';

export default function UserInformationPageSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      width={1200}
      height={768}
      style={{ borderRadius: 'var(--border-radius-medium)' }}
      animation="wave"
    />
  );
}
