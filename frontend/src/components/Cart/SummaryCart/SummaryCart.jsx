import { BsShieldFillExclamation, BsChevronDoubleRight } from 'react-icons/bs';
import css from './SummaryCart.module.css';
import { Link } from 'react-router-dom';

export default function SummaryBlock() {
  return (
    <div className={css.summary_block}>
      <div className={css.summarybox}>
        <div className={css.price_summary}>
          <p className={css.text_up}>
            <b>Разом</b>
          </p>
          <div className={css.wrapper}>
            <p className={css.text}>Вартість замовлення</p>
            <p className={css.text}>1941 грн</p>
          </div>
          <div className={css.wrapper}>
            <p className={css.text}>Доставка</p>
            <p className={css.text}>від 120 грн</p>
          </div>
          <hr />
          <div className={css.wrapper}>
            <p className={css.text}>
              <b>До сплати</b>
            </p>
            <p className={css.text}>
              <b>2061 грн</b>
            </p>
          </div>
        </div>
        <button className={css.btn_order} disabled>
          Оформити замовлення
        </button>
        <button className={css.btn}>Продовжити покупки</button>
      </div>
      <div className={css.infobox}>
        <BsShieldFillExclamation size={24} />
        <div>
          <p className={css.info_text}>
            Ви купуєте з послугою “Безпечна угода”
          </p>
          <Link className={css.info_link}>Більше деталей</Link>
        </div>
      </div>
      <div className={css.payment_infobox}>
        <p className={css.payment_info}>Способи оплати:&nbsp;</p>
        <p className={css.payment_pay}>LIQPAY</p>
        <svg width="14" height="14">
          <linearGradient id="myGradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="#9FDB57" />
            <stop offset="50%" stopColor="#71CA5E" />
            <stop offset="50%" stopColor="#1FADC3" />
            <stop offset="100%" stopColor="#36B98F" />
          </linearGradient>
          <BsChevronDoubleRight
            style={{ fill: 'url(#myGradient)' }}
            size={14}
          />
        </svg>
      </div>
    </div>
  );
}
