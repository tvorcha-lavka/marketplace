import css from './AdressInput.module.css';

export default function AddressInput({
  id,
  label,
  name,
  placeholder,
  value,
  onChange,
  className,
  onBlur,
  required = true,
}) {
  return (
    <div>
      <label htmlFor={id} className={css.detailsLabel} name={name}>
        {label}&nbsp;
        {required && <span>&#42;</span>}
      </label>

      <input
        id={id}
        name={name}
        className={className}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
      />
    </div>
  );
}
