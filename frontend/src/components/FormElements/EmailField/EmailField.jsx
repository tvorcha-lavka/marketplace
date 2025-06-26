import { Field } from 'formik';

import clsx from 'clsx';

import css from '../../FormElements/FormFieldStyles.module.css';

export default function EmailField({
  id,
  label,
  errors = {},
  touched = {},
  values = {},
  inputError = {},
  showLabel = true,
  inputWidth,
  disabled,
}) {
  const hasError = (errors.email && touched.email) || inputError.email;
  const isFilled = values.email && !errors.email;

  return (
    <div className={css.fieldWrapper}>
      {showLabel && (
        <label className={css.fieldLabel} htmlFor={`${id}-email`}>
          {label} <span className={css.requiredSymb}>&#42;</span>
        </label>
      )}

      <Field
        id={`${id}-email`}
        name="email"
        type="email"
        disabled={disabled}
        placeholder="example@gmail.com"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        className={clsx(
          css.formInput,
          values.email,
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
