import { useDispatch, useSelector } from 'react-redux';

import CourierDeliveryRender from '../CourierDeliveryRender/CourierDeliveryRender';
import RadioInput from '../../FormElements/RadioInput/RadioInput';
import DropdownCustomInput from '../../FormElements/DropdownCustomInput/DropdownCustomInput';

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

  const renderDropdowns = () => {
    const cityValue = currentData.city || '';
    const branchValue = currentData.branch || '';

    return (
      <div className={css.listWrap}>
        <DropdownCustomInput
          fieldKey="city"
          label="Місто"
          value={cityValue}
          placeholder="Введіть місто"
          options={getCityOptions()}
          onChange={(selected) => handleInputChange('city', selected)}
          disabled={false}
          mode="list"
          editable={true}
          inputWidth="614px"
        />
        <DropdownCustomInput
          fieldKey="branch"
          label="Відділення"
          value={branchValue}
          placeholder="Оберіть відділення"
          onChange={(selected) =>
            handleInputChange('branch', selected?.value || selected)
          }
          disabled={!cityValue}
          mode="list"
          editable={true}
          inputWidth="614px"
          options={getBranchOptions(cityValue)}
        />
      </div>
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
            <RadioInput
              id={`delivery-${owner}-${type}`}
              name={`deliveryData-${owner}`}
              value={type}
              checked={currentData.type === type}
              onChange={() => handleDeliveryTypeChange(type)}
              label={label}
              required
            />
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
