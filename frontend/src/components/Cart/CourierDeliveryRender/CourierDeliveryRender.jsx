import { useState } from 'react';

import FormInput from '../../FormElements/FormInput/FormInput';

import css from './CourierDeliveryRender.module.css';

export default function CourierDeliveryRender({
  deliveryData,
  owner,
  handleInputChange,
}) {
  const [touchedFields, setTouchedFields] = useState({});

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const isFieldTouched = (field) => touchedFields[field];
  const isFieldEmpty = (field) =>
    isFieldTouched(field) && !deliveryData[owner]?.[field]?.trim();

  const renderField = (field, label, placeholder, width) => (
    <FormInput
      id={field}
      name={field}
      label={label}
      placeholder={placeholder}
      value={deliveryData[owner]?.[field] || ''}
      onChange={(e) => handleInputChange(field, e.target.value)}
      onBlur={() => handleBlur(field)}
      showError={isFieldEmpty(field)}
      inputWidth={width}
    />
  );

  return (
    <div className={css.detailsWrapperAddress}>
      <div className={css.detailsInputAddress}>
        {renderField('city', 'Місто', 'місто', '226px')}
        {renderField('street', 'Вулиця', 'вулиця', '226px')}
        {renderField('house', 'Будинок', 'буд', '72px')}
        {renderField('apartment', 'Кв', 'кв', '54px')}
      </div>
    </div>
  );
}
