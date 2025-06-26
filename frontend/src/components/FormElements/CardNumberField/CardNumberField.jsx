import { Field } from 'formik';
import clsx from 'clsx';

import css from '../../FormElements/FormFieldStyles.module.css';

export default function CardNumberField({
  id,
  name,
  type = 'text',
  label,
  showLabel = true,
  placeholder,
  touched = {},
  errors = {},
  inputError = {},
  values,
  inputWidth,
  disabled,
}) {
  const hasError = (errors[name] && touched[name]) || inputError[name];
  const isFilled = (touched[name] || values[name]) && !errors[name];

  const formatPhone = (digits) => {
    let result = '+38';
    if (digits.length > 0) result += ` (${digits.slice(0, 3)}`;
    if (digits.length >= 3) result += `) ${digits.slice(3, 6)}`;
    if (digits.length >= 6) result += `-${digits.slice(6, 8)}`;
    if (digits.length >= 8) result += `-${digits.slice(8, 10)}`;
    return result;
  };

  const formatCardExpire = (digits) => {
    const clean = digits.replace(/\D/g, '').slice(0, 6);
    if (clean.length <= 2) return clean;
    return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  };

  const formatters = {
    card_number: (val) =>
      val
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim(),

    card_cvv: (val) => val.replace(/\D/g, '').slice(0, 3),

    card_expire: (val) =>
      formatCardExpire(val.replace(/[^\d]/g, '').slice(0, 6)),

    card_holder: (val) => val.replace(/[^a-zA-Zа-яА-ЯіїєґІЇЄҐ'’ -]/g, ''),

    phone: (val) => {
      const raw = val.replace(/\D/g, '');
      const digits = raw.startsWith('38') ? raw.slice(2) : raw.slice(0, 10);
      return formatPhone(digits);
    },
  };

  const setCursorToEnd = (el) => {
    setTimeout(() => {
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }, 0);
  };

  const handleFocus = (e) => {
    if (name === 'phone' && e.target.value.trim() === '') {
      e.target.value = '+38 ';
      e.target.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (['phone', 'card_expire'].includes(name)) {
      setCursorToEnd(e.target);
    }
  };

  const handleClick = (e) => {
    if (['phone', 'card_expire'].includes(name)) {
      setCursorToEnd(e.target);
    }
  };

  const handleKeyDown = (e) => {
    if (!['phone', 'card_expire'].includes(name)) return;

    if (e.key === 'Backspace') {
      e.preventDefault();

      const raw = e.target.value
        .replace(/\D/g, '')
        .replace(/^38/, '')
        .slice(0, -1);
      const formatted =
        name === 'phone' ? formatPhone(raw) : formatCardExpire(raw);

      e.target.value = formatted;
      setCursorToEnd(e.target);
    }
  };

  const handleInput = (e) => {
    const formatter = formatters[name];
    if (!formatter) return;

    e.target.value = formatter(e.target.value);
  };

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
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
        onFocus={handleFocus}
        maxLength={
          name === 'card_number'
            ? 19
            : name === 'card_expire'
              ? 7
              : name === 'card_cvv'
                ? 3
                : undefined
        }
        onClick={handleClick}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
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
