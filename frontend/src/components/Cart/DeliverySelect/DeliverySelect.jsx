import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DropdownSelector from '../DropdownSelector/DropdownSelector';
import AddressInput from '../AddressInput/AddressInput';

import {
  cacheBranchList,
  cacheCityList,
  updateDeliveryData,
} from '../../../redux/basket/slice';
import {
  selectCart,
  selectCachedBranches,
  selectCachedCities,
  selectCachedPboxCities,
  selectCachedPostbox,
} from '../../../redux/basket/selectors';
import {
  branchList,
  cityList,
  deliveryOptions,
  getInitialDeliveryFields,
} from '../../../utils/deliveryDetails';

import css from './DeliverySelect.module.css';

export default function DeliverySelect({ owner, onDeliveryChange }) {
  const [localState, setLocalState] = useState({
    city: '',
    branch: '',
    postboxCity: '',
    postbox: '',
    courierCity: '',
  });

  const dispatch = useDispatch();
  const { deliveryData } = useSelector(selectCart);

  const handleDeliveryTypeChange = (owner, type) => {
    const baseFields = getInitialDeliveryFields(type);
    const updated = { ...deliveryData, [owner]: baseFields };
    dispatch(updateDeliveryData({ [owner]: baseFields }));
    onDeliveryChange?.(updated);
  };

  const handleInputChange = (field, value) => {
    const updated = {
      ...deliveryData,
      [owner]: {
        ...deliveryData[owner],
        [field]: typeof value === 'string' ? value : String(value),
      },
    };
    dispatch(updateDeliveryData({ [owner]: updated[owner] }));
    onDeliveryChange?.(updated);
  };

  const renderDropdowns = ({
    citySelector,
    branchSelector,
    cityField,
    branchField,
    cityValue,
    branchValue,
  }) => (
    <ul className={css.detailsBox}>
      <DropdownSelector
        label="Місто"
        placeholder="Введіть місто"
        cachedDataSelector={citySelector}
        cacheAction={cacheCityList}
        updateAction={updateDeliveryData}
        fetchData={cityList}
        value={cityValue}
        onChange={(value) => handleInputChange(cityField, value)}
        fieldKey={cityField}
      />
      <DropdownSelector
        label="Відділення"
        placeholder="Оберіть відділення"
        cachedDataSelector={branchSelector}
        cacheAction={cacheBranchList}
        updateAction={updateDeliveryData}
        fetchData={branchList}
        value={branchValue}
        onChange={(value) => handleInputChange(branchField, value)}
        fieldKey={branchField}
      />
    </ul>
  );

  const renderDeliveryDetails = (type) => {
    switch (type) {
      case 'nova-poshta':
        return renderDropdowns({
          citySelector: selectCachedCities,
          branchSelector: selectCachedBranches,
          cityField: 'city',
          branchField: 'branch',
          cityValue: deliveryData[owner]?.city || '',
          branchValue: deliveryData[owner]?.branch || '',
        });

      case 'post_box':
        return renderDropdowns({
          citySelector: selectCachedPboxCities,
          branchSelector: selectCachedPostbox,
          cityField: 'city',
          branchField: 'branch',
          cityValue: deliveryData[owner]?.city || '',
          branchValue: deliveryData[owner]?.branch || '',
        });

      case 'ukrposhta':
        return renderDropdowns({
          citySelector: selectCachedCities,
          branchSelector: selectCachedBranches,
          cityField: 'city',
          branchField: 'branch',
          cityValue: deliveryData[owner]?.city || '',
          branchValue: deliveryData[owner]?.branch || '',
        });

      case 'courier':
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
                  className={`${css.detailsInputCity} ${deliveryData[owner]?.city ? css.inputFilled : ''}`}
                />
                <AddressInput
                  id="street"
                  label="Вулиця"
                  name="street"
                  placeholder="вулиця"
                  value={deliveryData[owner]?.street || ''}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className={`${css.detailsInputCity} ${deliveryData[owner]?.street ? css.inputFilled : ''}`}
                />
                <AddressInput
                  id="house"
                  label="Будинок"
                  name="house"
                  placeholder="будинок"
                  value={deliveryData[owner]?.house || ''}
                  onChange={(e) => handleInputChange('house', e.target.value)}
                  className={`${css.detailsInputHouse} ${deliveryData[owner]?.house ? css.inputFilled : ''}`}
                />
                <AddressInput
                  id="apartment"
                  label="Кв"
                  name="apartment"
                  placeholder="кв"
                  value={deliveryData[owner]?.apartment || ''}
                  onChange={(e) =>
                    handleInputChange('apartment', e.target.value)
                  }
                  className={`${css.detailsInputApart} ${deliveryData[owner]?.apartment ? css.inputFilled : ''}`}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
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
                checked={deliveryData[owner]?.type === type}
                onChange={() => handleDeliveryTypeChange(owner, type)}
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

          {deliveryData[owner]?.type === type && (
            <div className={css.deliveryDetails}>
              {renderDeliveryDetails(type)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
