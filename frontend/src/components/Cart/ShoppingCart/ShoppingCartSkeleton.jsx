import Skeleton from '@mui/material/Skeleton';

export default function ShoppingCartSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      width={694}
      height={583}
      style={{
        borderRadius: 'var(--border-radius-medium)',
        marginBottom: '80px',
      }}
      animation="wave"
    />
  );
}
