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
  values,
}) {
  const hasError = (errors[name] && touched[name]) || inputError[name];
  const isFilled = (touched[name] || values[name]) && !errors[name];

  const handleFocus = (e) => {
    if (name === 'phone') {
      if (e.target.value.trim() === '') {
        e.target.value = '+38 ';
        const event = new Event('input', { bubbles: true });
        e.target.dispatchEvent(event);
      }

      setTimeout(() => {
        const len = e.target.value.length;
        e.target.setSelectionRange(len, len);
      }, 0);
    }
  };

  const handleClick = (e) => {
    if (name === 'phone') {
      setTimeout(() => {
        const len = e.target.value.length;
        if (e.target.selectionStart < len) {
          e.target.setSelectionRange(len, len);
        }
      }, 0);
    }
  };

  const handleKeyDown = (e) => {
    if (name !== 'phone') return;

    const input = e.target;
    const value = input.value;
    const digits = value.replace(/\D/g, '').slice(2);

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits.length === 0) return;

      const newDigits = digits.slice(0, -1);
      const formatted = formatPhone(newDigits);
      input.value = formatted;

      setTimeout(() => {
        const len = input.value.length;
        input.setSelectionRange(len, len);
      }, 0);
    }
  };

  const handleInput = (e) => {
    if (name !== 'phone') return;

    const input = e.target;
    const raw = input.value.replace(/\D/g, '');
    const inputChar = raw.slice(-1);

    if (!/^\d$/.test(inputChar)) {
      e.preventDefault();
      input.value = input.value;
      return;
    }

    let digits = raw.startsWith('38') ? raw.slice(2) : raw;
    if (digits.length > 10) digits = digits.slice(0, 10);

    const formatted = formatPhone(digits);
    input.value = formatted;

    setTimeout(() => {
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }, 0);
  };

  const formatPhone = (digits) => {
    let result = '+38';
    if (digits.length > 0) result += ` (${digits.slice(0, 3)}`;
    if (digits.length >= 3) result += `) ${digits.slice(3, 6)}`;
    if (digits.length >= 6) result += `-${digits.slice(6, 8)}`;
    if (digits.length >= 8) result += `-${digits.slice(8, 10)}`;
    return result;
  };

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
        onFocus={handleFocus}
        onClick={handleClick}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
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
