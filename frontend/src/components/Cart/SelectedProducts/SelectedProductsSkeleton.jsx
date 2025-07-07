import Skeleton from '@mui/material/Skeleton';

export default function SelectedProductsSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      width={490}
      height={300}
      style={{
        borderRadius: 'var(--border-radius-medium)',
      }}
      animation="wave"
    />
  );
}
