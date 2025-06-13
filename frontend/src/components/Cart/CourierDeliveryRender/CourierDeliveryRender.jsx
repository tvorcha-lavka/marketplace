import { useState } from 'react';
import AddressInput from '../AddressInput/AddressInput'; 

import css from './CourierDeliveryRender.module.css';

export default function CourierDeliveryRender({ deliveryData, owner, handleInputChange }) {
  const [touchedFields, setTouchedFields] = useState({});

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const fieldHasError = (field) =>
    touchedFields[field] && !deliveryData[owner]?.[field];

  const inputClass = (field) => {
    const fieldClassMap = {
      city: css.detailsInputCity,
      street: css.detailsInputCity,
      house: css.detailsInputHouse,
      apartment: css.detailsInputApart,
    };

    return [
      fieldClassMap[field],
      deliveryData[owner]?.[field] ? css.inputFilled : '',
      fieldHasError(field) ? css.inputError : '',
    ]
      .filter(Boolean)
      .join(' ');
  };

  const hasErrors = ['city', 'street', 'house', 'apartment'].some((field) =>
    fieldHasError(field)
  );

  return (
    <div className={css.detailsBox}>
      <div className={css.detailsWrapperAddress}>
        <div className={css.detailsInputAddress}>
          <AddressInput
            id="city"
            label="Місто"
            name="city"
            placeholder="місто"
            value={deliveryData[owner]?.city || ''}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={inputClass('city')}
            onBlur={() => handleBlur('city')}
          />

          <AddressInput
            id="street"
            label="Вулиця"
            name="street"
            placeholder="вулиця"
            value={deliveryData[owner]?.street || ''}
            onChange={(e) => handleInputChange('street', e.target.value)}
            className={inputClass('street')}
            onBlur={() => handleBlur('street')}
          />

          <AddressInput
            id="house"
            label="Будинок"
            name="house"
            placeholder="буд"
            value={deliveryData[owner]?.house || ''}
            onChange={(e) => handleInputChange('house', e.target.value)}
            className={inputClass('house')}
            onBlur={() => handleBlur('house')}
          />

          <AddressInput
            id="apartment"
            label="Кв"
            name="apartment"
            placeholder="кв"
            value={deliveryData[owner]?.apartment || ''}
            onChange={(e) => handleInputChange('apartment', e.target.value)}
            className={inputClass('apartment')}
            onBlur={() => handleBlur('apartment')}
          />
        </div>
        {hasErrors && (
          <p className={css.errorMessage}>
            Усі поля обов&#8217;язкові для заповнення
          </p>
        )}
      </div>
    </div>
  );
}
