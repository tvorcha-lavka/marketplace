import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DropdownSelector from '../DropdownSelector/DropdownSelector';
import AddressInput from '../AddressInput/AddressInput';

import {
  cacheBranchList,
  cacheCityList,
  cachePboxCityList,
  cachePostboxList,
  updateDeliveryData,
} from '../../../redux/basket/slice';
import {
  selectCart,
  selectCachedBranches,
  selectCachedCities,
  selectCachedPboxCities,
  selectCachedPostbox,
} from '../../../redux/basket/selectors';
import { branchList, cityList } from '../../../utils/deliveryDetails';

import css from './DeliverySelect.module.css';

export default function DeliverySelect({ owner, onDeliveryChange }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedPboxCity, setSelectedPboxCity] = useState('');
  const [selectedPostbox, setSelectedPostbox] = useState('');
  const [city, setCity] = useState('');

  const dispatch = useDispatch();

  const { deliveryData } = useSelector(selectCart);

  const handleDeliveryTypeChange = (owner, type) => {
    const updatedData = {
      ...deliveryData,
      [owner]: { type },
    };
    if (type === 'nova-poshta' || type === 'post_box') {
      updatedData[owner].city = '';
      updatedData[owner].branch = '';
    } else if (['courier', 'ukrposhta'].includes(type)) {
      updatedData[owner].city = '';
      updatedData[owner].street = '';
      updatedData[owner].house = '';
      updatedData[owner].apartment = '';
    }

    dispatch(updateDeliveryData({ [owner]: updatedData[owner] }));
    if (onDeliveryChange) onDeliveryChange(JSON.stringify(updatedData));
  };

  const handleInputChange = (owner, field, value) => {
    if (typeof value !== 'string') {
      value = String(value);
    }

    const updatedData = {
      ...deliveryData,
      [owner]: { ...deliveryData[owner], [field]: value },
    };
    dispatch(updateDeliveryData({ [owner]: updatedData[owner] }));

    if (onDeliveryChange) onDeliveryChange(updatedData);
  };
  return (
    <ul>
      {['nova-poshta', 'post_box', 'courier', 'ukrposhta'].map((type) => (
        <li className={css.deliveryItem} key={type}>
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
                {
                  {
                    'nova-poshta': 'Доставка Нова Пошта у відділення',
                    post_box: 'Доставка Укрпошта до поштомату',
                    courier: 'Курʼєрська доставка',
                    ukrposhta: 'Укрпошта курʼєрська',
                  }[type]
                }
              </label>
            </div>
            <p>
              {
                {
                  'nova-poshta': 'від 120 грн',
                  post_box: 'від 120 грн',
                  courier: 'від 135 грн',
                  ukrposhta: 'від 80 грн',
                }[type]
              }
            </p>
          </div>

          {deliveryData[owner]?.type === type && (
            <div className={css.deliveryDetails}>
              {type === 'nova-poshta' && (
                <ul className={css.detailsBox}>
                  <DropdownSelector
                    label="Місто"
                    placeholder="Введіть місто"
                    cachedDataSelector={selectCachedCities}
                    cacheAction={cacheCityList}
                    updateAction={updateDeliveryData}
                    fetchData={cityList}
                    value={selectedCity}
                    onChange={(value) =>
                      handleInputChange(owner, 'city', String(value))
                    }
                    fieldKey="city"
                  />

                  <DropdownSelector
                    label="Відділення"
                    placeholder="Оберіть відділення"
                    cachedDataSelector={selectCachedBranches}
                    cacheAction={cacheBranchList}
                    updateAction={updateDeliveryData}
                    fetchData={branchList}
                    value={selectedBranch}
                    onChange={(value) =>
                      handleInputChange(owner, 'branch', value)
                    }
                    fieldKey="branch"
                  />
                </ul>
              )}

              {type === 'post_box' && (
                <div className={css.detailsBox}>
                  <DropdownSelector
                    label="Місто"
                    placeholder="Введіть місто"
                    cachedDataSelector={selectCachedPboxCities}
                    cacheAction={cachePboxCityList}
                    updateAction={updateDeliveryData}
                    fetchData={cityList}
                    value={selectedPboxCity}
                    onChange={(value) =>
                      handleInputChange(owner, 'city', value)
                    }
                    fieldKey="city"
                  />

                  <DropdownSelector
                    label="Поштомат"
                    placeholder="№ поштомату"
                    cachedDataSelector={selectCachedPostbox}
                    cacheAction={cachePostboxList}
                    updateAction={updateDeliveryData}
                    fetchData={branchList}
                    value={selectedPostbox}
                    onChange={(value) =>
                      handleInputChange(owner, 'branch', value)
                    }
                    fieldKey="branch"
                  />
                </div>
              )}

              {type === 'courier' && (
                <div className={css.detailsBox}>
                  <div className={css.detailsWrapperAddress}>
                    <div className={css.detailsInputAddress}>
                      <AddressInput
                        id="city"
                        label="Місто"
                        name="city"
                        placeholder="місто"
                        value={city}
                        onChange={(e) => {
                          handleInputChange(owner, 'city', e.target.value);
                          setCity(e.target.value);
                        }}
                        className={css.detailsInputCity}
                      />

                      <AddressInput
                        id="street"
                        label="Вулиця"
                        name="street"
                        placeholder="вулиця"
                        value={deliveryData[owner].street || ''}
                        onChange={(e) =>
                          handleInputChange(owner, 'street', e.target.value)
                        }
                        className={css.detailsInputCity}
                      />

                      <AddressInput
                        id="house"
                        label="Будинок"
                        name="house"
                        placeholder="будинок"
                        value={deliveryData[owner].house || ''}
                        onChange={(e) =>
                          handleInputChange(owner, 'house', e.target.value)
                        }
                        className={css.detailsInputHouse}
                      />

                      <AddressInput
                        id="apartment"
                        label="Кв"
                        name="apartment"
                        placeholder="кв"
                        value={deliveryData[owner].apartment || ''}
                        onChange={(e) =>
                          handleInputChange(owner, 'apartment', e.target.value)
                        }
                        className={css.detailsInputApart}
                      />
                    </div>
                  </div>
                </div>
              )}

              {type === 'ukrposhta' && (
                <ul className={css.detailsBox}>
                  <DropdownSelector
                    label="Місто"
                    placeholder="Введіть місто"
                    cachedDataSelector={selectCachedCities}
                    cacheAction={cacheCityList}
                    updateAction={updateDeliveryData}
                    fetchData={cityList}
                    value={selectedCity}
                    onChange={(value) =>
                      handleInputChange(owner, 'city', String(value))
                    }
                    fieldKey="city"
                  />

                  <DropdownSelector
                    label="Відділення"
                    placeholder="Оберіть відділення"
                    cachedDataSelector={selectCachedBranches}
                    cacheAction={cacheBranchList}
                    updateAction={updateDeliveryData}
                    fetchData={branchList}
                    value={selectedBranch}
                    onChange={(value) =>
                      handleInputChange(owner, 'branch', value)
                    }
                    fieldKey="branch"
                  />
                </ul>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
