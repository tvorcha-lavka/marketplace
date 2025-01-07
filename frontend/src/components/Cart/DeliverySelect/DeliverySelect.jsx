import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  cacheBranchList,
  cacheCityList,
  cachePostboxList,
  updateDeliveryData,
} from '../../../redux/cart/cartSlice';
import DropdownSelector from '../DropdownSelector/DropdownSelector';
import css from './DeliverySelect.module.css';

export default function DeliverySelect({ seller, onDeliveryChange }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedPostbox, setSelectedPostbox] = useState('');

  const [city, setCity] = useState('');
  const { deliveryData } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const cityList = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро'];
  const branchList = [
    'Від. №1: Київ, вул.Хрещатик 39, 40-566',
    'Від. №2: Київ, вул.Петра Саксаганського 39, 40-566',
    'Від. №3: Київ, вул.Збройних Сил України 39, 40-566',
    'Від. №4: Київ, вул.Хрещатик 39, 40-566',
    'Від. №5: Київ, вул. Лесі Українки 45, 40-566',
  ];

  const handleDeliveryTypeChange = (seller, type) => {
    const updatedData = {
      ...deliveryData,
      [seller]: { type },
    };
    if (type === 'nova-poshta') {
      updatedData[seller].city = '';
      updatedData[seller].branch = '';
      updatedData[seller].postbox = '';
    } else if (type === 'post_box') {
      updatedData[seller].city = '';
      updatedData[seller].postbox = '';
    } else if (['courier', 'ukrposhta'].includes(type)) {
      updatedData[seller].city = '';
      updatedData[seller].street = '';
      updatedData[seller].house = '';
      updatedData[seller].apartment = '';
    }
    dispatch(updateDeliveryData({ [seller]: updatedData[seller] }));
    if (onDeliveryChange) onDeliveryChange(JSON.stringify(updatedData));
  };

  const handleInputChange = (seller, field, value) => {
    const updatedData = { ...deliveryData, [field]: value };
    dispatch(
      updateDeliveryData({
        seller,
        data: { [field]: value },
      })
    );
    if (onDeliveryChange) onDeliveryChange(updatedData);
  };

  return (
    <ul>
      {['nova-poshta', 'post_box', 'courier', 'ukrposhta'].map((type) => (
        <li className={css.deliveryItem} key={type}>
          <div className={css.deliverybox}>
            <div className={css.deliveryOption}>
              <input
                className={css.optionInput}
                id={`delivery-${seller}-${type}`}
                type="radio"
                name={`deliveryData-${seller}`}
                value={type}
                checked={deliveryData[seller]?.type === type}
                onChange={() => handleDeliveryTypeChange(seller, type)}
                required
              />
              <label
                htmlFor={`delivery-${seller}-${type}`}
                className={css.deliveryOption}
              >
                {type === 'nova-poshta' && 'Доставка Нова Пошта у відділення'}
                {type === 'post_box' && 'Доставка Нова Пошта у поштомат'}
                {type === 'courier' && 'Доставка кур’єром Нова Пошта'}
                {type === 'ukrposhta' && 'Доставка Укрпошта у відділення'}
              </label>
            </div>
            <p>
              {type === 'nova-poshta' && 'від 120 грн'}
              {type === 'post_box' && 'від 120 грн'}
              {type === 'courier' && 'від 135 грн'}
              {type === 'ukrposhta' && 'від 80 грн'}
            </p>
          </div>

          {deliveryData[seller]?.type === type && (
            <div className={css.deliveryDetails}>
              {type === 'nova-poshta' && (
                <ul className={css.detailsbox}>
                  <DropdownSelector
                    label="Місто"
                    placeholder="Введіть місто"
                    cachedDataSelector={(state) => state.cart.cachedCities}
                    cacheAction={cacheCityList}
                    updateAction={updateDeliveryData}
                    fetchData={cityList}
                    value={selectedCity}
                    onChange={setSelectedCity}
                    fieldKey="city"
                  />

                  <DropdownSelector
                    label="Відділення"
                    placeholder="Оберіть відділення"
                    cachedDataSelector={(state) => state.cart.cachedBranches}
                    cacheAction={cacheBranchList}
                    updateAction={updateDeliveryData}
                    fetchData={branchList}
                    value={selectedBranch}
                    onChange={setSelectedBranch}
                    fieldKey="branch"
                  />
                </ul>
              )}

              {type === 'post_box' && (
                <div className={css.detailsbox}>
                  <DropdownSelector
                    label="Місто"
                    placeholder="Введіть місто"
                    cachedDataSelector={(state) => state.cart.cachedCities}
                    cacheAction={cacheCityList}
                    updateAction={updateDeliveryData}
                    fetchData={cityList}
                    value={selectedCity}
                    onChange={setSelectedCity}
                    fieldKey="city"
                  />

                  <DropdownSelector
                    label="Поштомат"
                    placeholder="№ поштомату"
                    cachedDataSelector={(state) => state.cart.cachedCities}
                    cacheAction={cachePostboxList}
                    updateAction={updateDeliveryData}
                    fetchData={branchList}
                    value={selectedPostbox}
                    onChange={setSelectedPostbox}
                    fieldKey="post_box"
                  />
                </div>
              )}

              {(type === 'courier' || type === 'ukrposhta') && (
                <div className={css.detailsbox}>
                  <div className={css.detailsWrapperAddress}>
                    <div className={css.detailsInputAddress}>
                      <div>
                        <label
                          htmlFor="city"
                          className={css.detailsLabel}
                          name="city"
                        >
                          Місто&#42;
                        </label>
                        <input
                          id="city"
                          name="city"
                          className={css.detailsInputCity}
                          type="text"
                          placeholder="місто"
                          value={city}
                          onChange={(e) => {
                            handleInputChange(seller, 'city', e.target.value);
                            console.log(setCity(e.target.value));
                          }}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="street"
                          className={css.detailsLabel}
                          name="street"
                        >
                          Вулиця&#42;
                        </label>

                        <input
                          id="street"
                          name="street"
                          className={css.detailsInputCity}
                          type="text"
                          placeholder="вулиця"
                          value={deliveryData[seller].street || ''}
                          onChange={(e) =>
                            handleInputChange(seller, 'street', e.target.value)
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="house"
                          className={css.detailsLabel}
                          name="house"
                        >
                          Будинок&#42;
                        </label>

                        <input
                          id="house"
                          name="house"
                          className={css.detailsInputHouse}
                          type="text"
                          placeholder="будинок"
                          value={deliveryData[seller].house || ''}
                          onChange={(e) =>
                            handleInputChange(seller, 'house', e.target.value)
                          }
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="apatrtment"
                          className={css.detailsLabel}
                          name="apatrtment"
                        >
                          Кв&#42;
                        </label>

                        <input
                          id="apatrtment"
                          name="apatrtment"
                          className={css.detailsInputApart}
                          type="text"
                          placeholder="кв"
                          value={deliveryData[seller].apatrtment || ''}
                          onChange={(e) =>
                            handleInputChange(
                              seller,
                              'apatrtment',
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
