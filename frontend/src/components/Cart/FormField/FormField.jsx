import { Field, ErrorMessage } from 'formik';
import clsx from 'clsx';

import css from './FormField.module.css';

export default function FormField({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  touched = {},
  errors = {},
  inputError = {},
  showLabel = true,
  wrapperClassName,
  inputClassName,
}) {
	const hasError = (errors[name] && touched[name]) || inputError[name];
	
	const isFilled = touched[name] && !errors[name];

  return (
    <div
      className={clsx(
        css.fieldWrapper,
        wrapperClassName,
        hasError ? css.wrapperError : css.wrapperNormal
      )}
    >
      {showLabel && (
        <label htmlFor={`${id}-${name}`} className={css.fieldLabel}>
          {label} <span className={css.requiredSymb}>&#42;</span>
        </label>
      )}

      <Field
        as="input"
        id={`${id}-${name}`}
        name={name}
        type={type}
        placeholder={placeholder}
        list={`${id}-${name}List`}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        onInput={(e) => {
          if (name === 'phone') {
            e.target.value = e.target.value
              .replace(/[^\d+]/g, '')
              .replace(/(?!^)\+/g, '');
          }
        }}
        className={clsx(
          css.formInput,
          inputClassName,
					hasError && css.fieldInputError,
					isFilled && css.fieldInputFilled
        )}
      />

      <ErrorMessage name={name} component="div" className={css.error} />
    </div>
  );
}
