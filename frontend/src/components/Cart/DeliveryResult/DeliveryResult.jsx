import { useSelector } from 'react-redux';

import { selectCart } from '../../../redux/basket/selectors';

import css from './DeliveryResult.module.css';

export default function DeliveryResult({ owner }) {
  const { deliveryData } = useSelector(selectCart);
  const delivery = deliveryData[owner];

  if (!delivery || !delivery.type) return null;

  const { type, branch, postbox, city, street, house, apartment } = delivery;

  const commonBox = (text, extra = null) => (
    <>
      <div className={css.resultBox}>
        <div className={css.resultInput}></div>
        <p className={css.resultText}>{text}</p>
      </div>
      {extra}
    </>
  );

  const renderByType = {
    'nova-poshta': commonBox(
      'Доставка Нова Пошта у відділення',
      <>
        <p className={css.resultText}>
          <b>Адреса відділення:</b>&nbsp;{branch}
        </p>
        <p className={css.resultText}>
          <b>Години роботи:</b>&nbsp;
        </p>
      </>
    ),

    post_box: commonBox(
      'Доставка Нова Пошта у поштомат',
      <>
        <p className={css.resultText}>
          <b>Адреса поштомату:</b>&nbsp;{branch}
        </p>
        <p className={css.resultText}>{postbox}</p>
      </>
    ),

    courier: commonBox(
      'Доставка кур`єром',
      <p className={css.resultText}>
        <b>Адреса доставки: </b>&nbsp;
        {[street, house, apartment, city].filter(Boolean).join(', ')}
      </p>
    ),

    ukrposhta: commonBox(
      'Доставка Укрпошта у відділення',
      <>
        <p className={css.resultText}>
          <b>Адреса відділення:</b>&nbsp;{branch}
        </p>
        <p className={css.resultText}>
          <b>Години роботи:</b>&nbsp; Пн-Сб 09:00 - 19:00, Нд - вихідний
        </p>
      </>
    ),
  };

  return (
    <div className={css.deliveryItem}>
      <div className={css.deliveryResultBlock}>
        {renderByType[type] || null}
      </div>
    </div>
  );
}
