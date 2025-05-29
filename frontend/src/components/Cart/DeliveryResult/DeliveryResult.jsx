import { useSelector } from 'react-redux';

import css from './DeliveryResult.module.css';

export default function DeliveryResult({ seller }) {
  const { deliveryData } = useSelector((state) => state.cart);

  return (
    <div className={css.deliveryItem}>
      <div className={css.deliveryResultBlock}>
        {deliveryData[seller].type === 'nova-poshta' && (
          <>
            <div className={css.resultBox}>
              <div className={css.resultInput}></div>
              <p className={css.resultText}>Доставка Нова Пошта у відділення</p>
            </div>
            <p className={css.resultText}>
              <b>Адреса відділення:</b>&nbsp;
              {deliveryData[seller].branch}
            </p>
            <p className={css.resultText}>
              <b>Години роботи:</b>&nbsp;
            </p>
          </>
        )}
        {deliveryData[seller].type === 'post_box' && (
          <>
            <div className={css.resultBox}>
              <div className={css.resultInput}></div>
              <p className={css.resultText}>Доставка Нова Пошта у поштомат</p>
            </div>
            <p className={css.resultText}>
              <b>Адреса поштомату:</b>&nbsp;
              {deliveryData[seller].city}
            </p>
            <p className={css.resultText}>{deliveryData[seller].postbox}</p>
          </>
        )}
        {deliveryData[seller].type === 'courier' && (
          <>
            <div className={css.resultBox}>
              <div className={css.resultInput}></div>
              <p className={css.inputText}>
                Доставка кур&#8217;єром Нова Пошта
              </p>
            </div>
            <p className={css.resultText}>
              <b> Адреса доставки: </b>&nbsp;
              {deliveryData[seller].street},&nbsp;
              {deliveryData[seller].house},&nbsp;
              {deliveryData[seller].apartment},&nbsp;
              {deliveryData[seller].city}
            </p>
          </>
        )}

        {deliveryData[seller].type === 'ukrposhta' && (
          <>
            <div className={css.resultBox}>
              <div className={css.resultInput}></div>
              <p className={css.resultText}>Доставка Нова Пошта у відділення</p>
            </div>
            <p className={css.resultText}>
              <b> Адреса доставки: </b>&nbsp;
              {deliveryData[seller].street},&nbsp;
              {deliveryData[seller].house},&nbsp;
              {deliveryData[seller].apartment},&nbsp;
              {deliveryData[seller].city}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
