import { media } from '../../../utils/mediaConfig';

import css from './DeliveryOptions.module.css';

const deliveryType = [
  { name: 'Нова пошта', img: `${media}/logo/Nova_Poshta_logo.png` },
  { name: 'Укрпошта', img: `${media}/logo/ukrposhta_logo.png` },
];

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

      <div className={css.deliveryBox}>
        {deliveryType.map(({ name, img }) => {
          const isChecked =
            Array.isArray(isSelectedDelivery) &&
						isSelectedDelivery.includes(name);
					
          return (
            <label
              key={name}
              htmlFor={name}
              className={`${css.deliveryLabel} ${isChecked ? css.selected : ''}`}
            >
              <input
                id={name}
                type="checkbox"
                name="delivery"
                value={name}
                checked={isChecked}
                onChange={() => handleDeliveryChange(name)}
              />
              <span className={css.checkmark}></span>
              <img className={css.deliveryImg} src={img} alt={name} />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
