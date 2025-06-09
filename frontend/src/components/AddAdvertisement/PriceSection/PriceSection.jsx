import { useState, useEffect } from 'react';

import css from './PriceSection.module.css';

export default function PriceSection({ shouldReset }) {
  const [price, setPrice] = useState('');
  const [touched, setTouched] = useState(false);

  const isInvalid = touched && price.trim() === '';
  const error = isInvalid ? 'Ціна є обовʼязковою' : '';

  const handleChange = (e) => setPrice(e.target.value);
  const handleBlur = () => setTouched(true);

  const inputClass = `${css.inputAdvert} ${
    isInvalid ? css.inputError : price ? css.inputActive : ''
		}`;
	
		useEffect(() => {
      if (shouldReset) {
        setPrice('');
        setTouched(false);
      }
    }, [shouldReset]);

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>Умови продажу</h3>
      <div className={css.priceBox}>
        <label className={css.labelAdvert} htmlFor="">
          <p className={css.spanLabel}>Ціна &#42;</p>
          <input
            className={inputClass}
            placeholder="150"
            type="number"
            name="price"
            id="price"
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
