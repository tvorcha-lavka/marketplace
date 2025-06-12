import { useState } from 'react';

import css from './DescriptionField.module.css';

export default function DescriptionField({
  title,
  setTitle,
  description,
  setDescription,
}) {
  const [touched, setTouched] = useState({ title: false, description: false });

  function validateField({ value, touched, minLength, maxLength }) {
    const trimmed = value.trim();

    return {
      isEmpty: touched && trimmed === '',
      isTooShort: touched && trimmed.length > 0 && trimmed.length < minLength,
      isTooLong: value.length > maxLength,
      hasError:
        (touched && trimmed === '') ||
        (touched && trimmed.length > 0 && trimmed.length < minLength) ||
        value.length > maxLength,
    };
  }

  const {
    isEmpty: isTitleEmpty,
    isTooShort: isTitleTooShort,
    isTooLong: isTitleTooLong,
    hasError: hasTitleError,
  } = validateField({
    value: title,
    touched: touched.title,
    minLength: 15,
    maxLength: 50,
  });

  const {
    isEmpty: isDescriptionEmpty,
    isTooShort: isDescriptionTooShort,
    isTooLong: isDescriptionTooLong,
    hasError: hasDescriptionError,
  } = validateField({
    value: description,
    touched: touched.description,
    minLength: 40,
    maxLength: 4000,
  });

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>Опишіть вашу річ</h3>

      <label className={css.labelAdvert}>
        <p className={css.spanLabel}>Назва (Українською Мовою) &#42;</p>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Наприклад: Українська традиційна вишиванка жіночка Львівська"
          className={`${css.inputNameItem} ${title ? css.filled : ''} ${hasTitleError ? css.errorBorder : ''}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleBlur('title')}
        />

        {isTitleTooLong && (
          <p className={css.errorMessage}>
            Максимальна кількість символів - 50. Зараз: {title.length}
          </p>
        )}

        {isTitleTooShort && (
          <p className={css.errorMessage}>
            Мінімальна кількість символів - 15. Зараз: {title.trim().length}
          </p>
        )}

        {isTitleEmpty && (
          <p className={css.errorMessage}>Це поле не може бути порожнім</p>
        )}
      </label>

      <label className={css.labelAdvert}>
        <p className={css.spanLabel}>Опис (Українською Мовою) &#42;</p>
        <textarea
          name="description"
          id="description"
          rows="5"
          className={`${css.textarea} ${description ? css.filled : ''} ${hasDescriptionError ? css.errorBorder : ''}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => handleBlur('description')}
        />

        {isDescriptionTooShort && (
          <p className={css.errorMessage}>
            Мінімальна кількість символів - 40. Зараз:{' '}
            {description.trim().length}
          </p>
        )}

        {isDescriptionEmpty && (
          <p className={css.errorMessage}>Це поле не може бути порожнім</p>
        )}

        {isDescriptionTooLong && (
          <p className={css.errorMessage}>
            Максимальна кількість символів - 4000. Зараз: {title.length}
          </p>
        )}
      </label>
    </fieldset>
  );
}
