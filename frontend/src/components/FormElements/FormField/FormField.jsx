import { Field } from 'formik';

import clsx from 'clsx';

import css from '../../FormElements/FormFieldStyles.module.css';

export default function FormField({
  id,
  name,
  label,
  placeholder,
  touched = {},
  errors = {},
  inputError = {},
  showLabel = true,
  values,
  inputWidth,
  disabled,
}) {
  const hasError = (errors[name] && touched[name]) || inputError[name];
  const isFilled = (touched[name] || values[name]) && !errors[name];

  return (
    <div className={css.fieldWrapper}>
      {showLabel && (
        <label htmlFor={`${id}-${name}`} className={css.fieldLabel}>
          {label} <span className={css.requiredSymb}>&#42;</span>
        </label>
      )}

      <Field
        id={`${id}-${name}`}
        name={name}
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        disabled={disabled}
        className={clsx(
          css.formInput,
          values,
          hasError && css.fieldInputError,
          isFilled && css.fieldInputFilled
        )}
        style={{
          width: inputWidth,
        }}
      />
    </div>
  );
}
