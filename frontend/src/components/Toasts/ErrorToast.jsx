import { GoAlert } from 'react-icons/go';

export default function ErrorToast({ message }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--error-red)',
        color: 'var(--default-white)',
        width: '450px',
        height: '100px',
        padding: '15px',
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
      <GoAlert
        style={{
          width: 'var(--icon-size-large)',
          height: 'var(--icon-size-large)',
          fontSize: '32px',
          color: 'var(--default-white)',
        }}
      />
      {message}
    </div>
  );
}
