import { useSelector } from 'react-redux';

import { selectCart } from '../../../redux/basket/selectors';

import css from './DeliveryResult.module.css';

export default function DeliveryResult({ owner }) {
  const { deliveryData } = useSelector(selectCart);

  return (
    <div className={css.deliveryItem}>
      <div className={css.deliveryResultBlock}>
        {deliveryData[owner].type === 'nova-poshta' && (
          <>
            <div className={css.resultBox}>
              <div className={css.resultInput}></div>
              <p className={css.resultText}>Доставка Нова Пошта у відділення</p>
            </div>
            <p className={css.resultText}>
              <b>Адреса відділення:</b>&nbsp;
              {deliveryData[owner].branch}
            </p>
            <p className={css.resultText}>
              <b>Години роботи:</b>&nbsp;
            </p>
          </>
        )}
        {deliveryData[owner].type === 'post_box' && (
          <>
            <div className={css.resultBox}>
              <div className={css.resultInput}></div>
              <p className={css.resultText}>Доставка Нова Пошта у поштомат</p>
            </div>
            <p className={css.resultText}>
              <b>Адреса поштомату:</b>&nbsp;
              {deliveryData[owner].city}
            </p>
            <p className={css.resultText}>{deliveryData[owner].postbox}</p>
          </>
        )}
        {deliveryData[owner].type === 'courier' && (
          <>
            <div className={css.resultBox}>
              <div className={css.resultInput}></div>
              <p className={css.inputText}>
                Доставка кур&#8217;єром Нова Пошта
              </p>
            </div>
            <p className={css.resultText}>
              <b> Адреса доставки: </b>&nbsp;
              {deliveryData[owner].street},&nbsp;
              {deliveryData[owner].house},&nbsp;
              {deliveryData[owner].apartment},&nbsp;
              {deliveryData[owner].city}
            </p>
          </>
        )}
        {deliveryData[owner].type === 'ukrposhta' && (
          <>
            <div className={css.resultBox}>
              <div className={css.resultInput}></div>
              <p className={css.resultText}>Доставка Нова Пошта у відділення</p>
            </div>
            <p className={css.resultText}>
              <b> Адреса доставки: </b>&nbsp;
              {deliveryData[owner].street},&nbsp;
              {deliveryData[owner].house},&nbsp;
              {deliveryData[owner].apartment},&nbsp;
              {deliveryData[owner].city}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
