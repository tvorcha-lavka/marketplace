import { media } from '../../../utils/mediaConfig';

import css from './Payment.module.css';

export default function Payment() {
  return (
    <>
      <h3 className={css.paymentTitle}>Оплата та гарантії</h3>
      <div className={css.payment}>
        <img
          className={css.liqpayLogo}
          src={`${media}/logo/logo_liqpay.svg`}
          alt="Liqpay logotype"
        />
        <ol className={css.paymentList}>
          <li className={css.paymentItem}>
            <p className={css.paymentText}>Безпечна оплата карткою</p>
          </li>
          <li className={css.paymentItem}>
            <p className={css.paymentText}>
              Без передоплати - Tvorcha Lavka гарантує безпеку
            </p>
          </li>
          <li className={css.paymentItem}>
            <p className={css.paymentText}>
              Повернемо гроші при відмові від посилки
            </p>
          </li>
        </ol>
      </div>
    </>
  );
}
