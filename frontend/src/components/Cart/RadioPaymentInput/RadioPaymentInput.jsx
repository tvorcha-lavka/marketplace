export default function RadioPaymentInput({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  className = '',
}) {
  return (
    <div className={className}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
