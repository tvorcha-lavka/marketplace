import { useState } from 'react';

import css from './PriceSection.module.css';

const MAX_PRICE = 99999999.99;

export default function PriceSection({ price, setPrice }) {
  const [touched, setTouched] = useState(false);

  const numericPrice = parseFloat(price.replace(',', '.'));

  const isEmpty = touched && price.trim() === '';
  const isTooHigh = touched && numericPrice > MAX_PRICE;

  let error = '';
  if (isEmpty) {
    error = 'Ціна є обовʼязковою';
  } else if (isTooHigh) {
    error = `Максимальна ціна: ${MAX_PRICE.toLocaleString('uk-UA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  const isInvalid = Boolean(error);

  const handleChange = (e) => {
    let value = e.target.value;

    let formatted = value.replace(/[^0-9.,]/g, '');

    formatted = formatted.replace(/-/g, '');

    if (formatted === '') {
      setPrice('');
      return;
    }

    if (/^[0.,]/.test(formatted)) {
      return;
    }

    setPrice(formatted);
  };
  const handleBlur = () => setTouched(true);

  const inputClass = `${css.inputAdvert} ${
    isInvalid ? css.inputError : price ? css.inputActive : ''
  }`;

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>Умови продажу</h3>
      <div className={css.priceBox}>
        <label className={css.labelAdvert} htmlFor="price">
          <p className={css.spanLabel}>Ціна &#42;</p>
          <input
            className={inputClass}
            placeholder="150"
            type="text"
            name="price"
            id="price"
            inputMode="decimal"
            value={price}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {isInvalid && <span className={css.errorText}>{error}</span>}
        </label>
      </div>
    </fieldset>
  );
}
