import Skeleton from '@mui/material/Skeleton';

export default function UserProfileSettingSkeleton() {
  return (
    <Skeleton
      variant="text"
      width={350}
      height={40}
      style={{
        marginBottom: 24,
        borderRadius: 'var(--border-radius)',
      }}
      animation="wave"
    />
  );
}
