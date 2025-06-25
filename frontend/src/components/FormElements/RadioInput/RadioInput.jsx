import clsx from 'clsx';

import css from './RadioInput.module.css';

export default function RadioInput({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  variant = 'default', // 'default' | 'extended'
}) {
  const wrapperClass = clsx(
    css.option,
    variant === 'extended' && css.optionExtended
  );

  return (
    <div className={wrapperClass}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={css.optionInput}
      />
      <label htmlFor={id} className={css.label}>
        {label}
      </label>
    </div>
  );
}
