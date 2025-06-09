import { useState, useEffect } from 'react';

import css from './DescriptionField.module.css';

export default function DescriptionField({ shouldReset }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [touched, setTouched] = useState({ title: false, description: false });

  const isTitleTooLong = title.length > 50;
  const isTitleEmpty = touched.title && title.trim() === '';
  const isTitleTooShort =
    touched.title && title.trim().length > 0 && title.trim().length < 15;

  const isDescriptionEmpty = touched.description && description.trim() === '';
  const isDescriptionTooShort =
    touched.description &&
    description.trim().length > 0 &&
    description.trim().length < 40;
  const isDescriptionTooLong = description.length > 4000;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    if (shouldReset) {
      setTitle('');
      setDescription('');
      setTouched({ title: false, description: false });
    }
  }, [shouldReset]);

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
          className={`${css.inputNameItem} ${title ? css.filled : ''} ${
            isTitleTooLong || isTitleEmpty ? css.errorBorder : ''
          }`}
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
          className={`${css.textarea} ${description ? css.filled : ''} ${
            isDescriptionEmpty ? css.errorBorder : ''
          }`}
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
