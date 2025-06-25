import CheckboxInput from '../../FormElements/CheckboxInput/CheckboxInput';
import { deliveryType } from '../../../utils/cartDetails';

import css from './DeliveryOptions.module.css';

export default function DeliveryOptions({
  isSelectedDelivery,
  setIsSelectedDelivery,
}) {
  const handleDeliveryChange = (option) => {
    const selected = Array.isArray(isSelectedDelivery)
      ? isSelectedDelivery
      : [];
    const updatedDelivery = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];

    setIsSelectedDelivery(updatedDelivery);
  };

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>
        Виберіть спосіб доставки
        <span className={css.advertSpan}>
          Оберіть зручні способи доставки для ваших товарів. За потреби ви легко
          зможете змінити його у своєму особистому кабінеті.
        </span>
      </h3>

      <ul className={css.deliveryBox}>
        {deliveryType.map(({ name, img, width, height }) => {
          const isChecked =
            Array.isArray(isSelectedDelivery) &&
            isSelectedDelivery.includes(name);

          return (
            <li key={name}>
              <CheckboxInput
                id={name}
                name={name}
                checked={isChecked}
                onChange={() => handleDeliveryChange(name)}
                icon={() => (
                  <img width={width} height={height} src={img} alt={name} />
                )}
                variant="image"
                width="261px"
              />
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
