import clsx from 'clsx';

import css from '../FormFieldStyles.module.css';

export default function FormInput({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  type = 'text',
  isTextarea = false,
  showLabel = true,
  inputWidth,
  error = '',
  showError = false,
  filled = false,
  rows = 5,
  variant = 'default', // 'default' | 'extended'
}) {
  const inputStyles = clsx(
    css.formInput,
    variant === 'extended' && css.formInputExtended
  );

  const isFilled = filled || (!!value && value.trim().length > 0);

  return (
    <div className={css.fieldWrapper}>
      {showLabel && (
        <label htmlFor={`${id}-${name}`} className={css.fieldLabel}>
          {label} <span className={css.requiredSymb}>&#42;</span>
        </label>
      )}

      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={clsx(inputStyles, {
            [css.fieldInputFilled]: isFilled,
            [css.fieldInputError]: showError === true,
          })}
          style={{
            width: inputWidth,
          }}
        />
      ) : (
        <input
          id={id}
          name={name}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={clsx(css.formInput, {
            [css.fieldInputFilled]: isFilled,
            [css.fieldInputError]: showError === true,
          })}
          style={{
            width: inputWidth,
          }}
        />
      )}

      {showError && error && <p className={css.additionalInfoError}>{error}</p>}
    </div>
  );
}
