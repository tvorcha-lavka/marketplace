import { useState } from 'react';

import css from './DescriptionField.module.css';

export default function DescriptionField() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [touched, setTouched] = useState({ title: false, description: false });

  const isTitleTooLong = title.length > 50;
  const isTitleEmpty = touched.title && title.trim() === '';
  const isDescriptionEmpty = touched.description && description.trim() === '';

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
          className={`${css.inputNameItem} ${title ? css.filled : ''} ${
            isTitleTooLong || isTitleEmpty ? css.errorBorder : ''
          }`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleBlur('title')}
        />
        {isTitleTooLong && (
          <p className={css.errorMessage}>
            Максимальна кількість символів — 50. Зараз: {title.length}
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
        {isDescriptionEmpty && (
          <p className={css.errorMessage}>Це поле не може бути порожнім</p>
        )}
      </label>
    </fieldset>
  );
}
