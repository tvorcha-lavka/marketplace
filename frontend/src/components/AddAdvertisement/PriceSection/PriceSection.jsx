import { useState } from 'react';

import FormInput from '../../FormElements/FormInput/FormInput';

import css from './PriceSection.module.css';

const MAX_PRICE = 99999999.99;

export default function PriceSection({ price, setPrice }) {
  const [touched, setTouched] = useState(false);

  const numericPrice = parseFloat(price.replace(',', '.'));

  const isEmpty = touched && price.trim() === '';
  const isTooHigh = touched && numericPrice > MAX_PRICE;
  const isInvalid = isEmpty || isTooHigh;
  const showErrorText = isInvalid;

  const error = isTooHigh
    ? `Максимальна ціна: ${MAX_PRICE.toLocaleString('uk-UA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
    : '';

  const handleChange = (e) => {
    let values = e.target.value;
    let formatted = values.replace(/[^0-9.,]/g, '');

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

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>Умови продажу</h3>
      <div className={css.priceBox}>
        <FormInput
          id="price"
          name="price"
          label="Ціна"
          placeholder="150"
          value={price}
          onChange={handleChange}
          onBlur={handleBlur}
          showError={showErrorText}
          error={error}
          inputWidth="230px"
        />
      </div>
    </fieldset>
  );
}
