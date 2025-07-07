import Skeleton from '@mui/material/Skeleton';

export default function CustomerDataSkeleton({ step = 1 }) {
  return (
    <>
      {step === 1 ? (
        <Skeleton
          variant="rectangular"
          width={694}
          height={317}
          style={{ borderRadius: 'var(--border-radius-medium)' }}
          animation="wave"
        />
      ) : (
        <Skeleton
          variant="rectangular"
          width={694}
          height={160}
          style={{ borderRadius: 'var(--border-radius-medium)' }}
          animation="wave"
        />
      )}
    </>
  );
}
