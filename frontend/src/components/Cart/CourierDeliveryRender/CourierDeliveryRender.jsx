import { useState } from 'react';

import FormInput from '../../FormElements/FormInput/FormInput';
import { FIELDS } from '../../../utils/cartDetails';

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

  return (
    <div className={css.detailsWrapperAddress}>
      <ul className={css.detailsInputAddress}>
        {FIELDS.map(({ field, label, placeholder, width }) => (
          <li key={field}>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
