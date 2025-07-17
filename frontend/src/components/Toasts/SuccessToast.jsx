import { FiCheckCircle } from 'react-icons/fi';

export default function SuccessToast({ message }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--primary-yellow-lighter)',
        color: 'var(--default-black)',
        width: '279px',
        height: '64px',
        padding: '20px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: 'var(--font-size-tiny)',
        fontWeight: 'var(--font-weight-bold)',
        borderLeft:
          'var(--border-width-biggest) var(--border-style) var(--primary-yellow)',
        boxShadow: 'var(--cart-shadow)',
      }}
    >
      <FiCheckCircle style={{ fontSize: '24px' }} />
      {message}
    </div>
  );
}
