import { useDispatch, useSelector } from 'react-redux';

import DropdownSelector from '../DropdownSelector/DropdownSelector';
import CourierDeliveryRender from '../CourierDeliveryRender/CourierDeliveryRender';

import { updateDeliveryData } from '../../../redux/basket/slice';
import { selectCart } from '../../../redux/basket/selectors';
import {
  fakeDepartments,
  deliveryOptions,
  getInitialDeliveryFields,
} from '../../../utils/cartDetails';

import css from './DeliverySelect.module.css';

export default function DeliverySelect({ owner, onDeliveryChange }) {
  const dispatch = useDispatch();
  const { deliveryData } = useSelector(selectCart);
  const currentData = deliveryData[owner] || {};

  const handleDeliveryTypeChange = (type) => {
    const baseFields = getInitialDeliveryFields(type);
    dispatch(updateDeliveryData({ [owner]: baseFields }));
    onDeliveryChange?.({ [owner]: baseFields });
  };

  const handleInputChange = (field, value) => {
    const updated = {
      ...currentData,
      [field]: value?.toString() || '',
    };
    dispatch(updateDeliveryData({ [owner]: updated }));
    onDeliveryChange?.({ [owner]: updated });
  };

  const getCityOptions = () => {
    return [...new Set(fakeDepartments.map((d) => d.city))];
  };

  const getBranchOptions = (city) => {
    return fakeDepartments
      .filter((d) => d.city === city)
      .map((d) => `${d.name}, ${d.address}`);
  };

  const renderDropdowns = (type) => {
    const cityValue = currentData.city || '';
    const branchValue = currentData.branch || '';

    return (
      <ul>
        <DropdownSelector
          label="Місто"
          placeholder="Введіть місто"
          fetchData={getCityOptions()}
          value={cityValue}
          onChange={(selected) => handleInputChange('city', selected)}
          fieldKey="city"
        />
        <DropdownSelector
          label="Відділення"
          placeholder="Оберіть відділення"
          fetchData={getBranchOptions(cityValue)}
          value={branchValue}
          onChange={(selected) =>
            handleInputChange('branch', selected?.value || selected)
          }
          fieldKey="branch"
        />
      </ul>
    );
  };

  const renderDeliveryDetails = (type) => {
    if (['nova-poshta', 'ukrposhta', 'post_box'].includes(type)) {
      return renderDropdowns(type);
    }
    if (type === 'courier') {
      return (
        <CourierDeliveryRender
          deliveryData={deliveryData}
          owner={owner}
          handleInputChange={handleInputChange}
        />
      );
    }
    return null;
  };

  return (
    <ul>
      {deliveryOptions.map(({ type, label, cost }) => (
        <li key={type} className={css.deliveryItem}>
          <div className={css.deliveryBox}>
            <div className={css.deliveryOption}>
              <input
                className={css.optionInput}
                id={`delivery-${owner}-${type}`}
                type="radio"
                name={`deliveryData-${owner}`}
                value={type}
                checked={currentData.type === type}
                onChange={() => handleDeliveryTypeChange(type)}
                required
              />
              <label
                htmlFor={`delivery-${owner}-${type}`}
                className={css.deliveryOption}
              >
                {label}
              </label>
            </div>
            <p>{cost}</p>
          </div>
          {currentData.type === type && (
            <div className={css.deliveryDetails}>
              {renderDeliveryDetails(type)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
