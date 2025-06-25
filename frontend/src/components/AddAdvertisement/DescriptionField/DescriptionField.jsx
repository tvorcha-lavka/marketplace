import { useState } from 'react';

import FormInput from '../../FormElements/FormInput/FormInput';

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
      isTooShort: touched && trimmed.length > 0 && trimmed.length < minLength,
      isTooLong: value.length > maxLength,
      hasError:
        (touched && trimmed === '') ||
        (touched && trimmed.length > 0 && trimmed.length < minLength) ||
        value.length > maxLength,
    };
  }

  const {
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

      <FormInput
        id="title"
        name="title"
        label="Назва (Українською Мовою)"
        placeholder="Наприклад: Українська традиційна вишиванка жіночка Львівська"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => handleBlur('title')}
        showError={hasTitleError}
        error={
          isTitleTooShort
            ? `Мінімальна кількість символів - 15. Зараз: ${title.trim().length}`
            : isTitleTooLong
              ? `Максимальна кількість символів - 50. Зараз: ${title.length}`
              : ''
        }
        inputWidth="1128px"
      />

      <FormInput
        id="description"
        name="description"
        label="Опис (Українською Мовою)"
        placeholder="Наприклад: Українська традиційна вишиванка жіночка Львівська"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={() => handleBlur('description')}
        isTextarea={true}
        rows={5}
        showError={hasDescriptionError}
        error={
          isDescriptionTooShort
            ? `Мінімальна кількість символів - 40. Зараз: ${description.trim().length}`
            : isDescriptionTooLong
              ? `Максимальна кількість символів - 4000. Зараз: ${description.length}`
              : ''
        }
        inputWidth="1128px"
        variant="extended"
      />
    </fieldset>
  );
}
