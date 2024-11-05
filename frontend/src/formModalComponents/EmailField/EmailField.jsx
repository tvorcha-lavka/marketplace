import { Field } from 'formik';

import clsx from 'clsx';

import css from './EmailField.module.css';

export default function EmailField({
  id,
  errors = {},
  touched = {},
  values = {},
  inputError = {},
  showLabel = true,
  children,
}) {
  const hasError = (errors.email && touched.email) || inputError.email;

  return (
		<div className={css.emailFieldWrapper}>
			
      {showLabel && (
        <label className={css.emailFieldLabel} htmlFor={`${id}-email`}>
          {children} <span className={css.requiredSymb}>&#42;</span>
        </label>
			)}
			
      <Field
        id={`${id}-email`}
        name="email"
        type="email"
        className={clsx(
          css.emailField,
          values.email && css.emailFieldFilled,
          hasError ? css.emailFieldError : ''
        )}
        placeholder="example@gmail.com"
        autoComplete="off"
      />
    </div>
  );
}
