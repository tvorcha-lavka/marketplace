import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsShieldFillExclamation, BsChevronDoubleRight } from 'react-icons/bs';
import CustomButton from '../../CustomButton/CustomButton';
import css from './SummaryCart.module.css';

export default function SummaryCart({ handleCheckout }) {
  const totalOrderPrice = useSelector((state) => state.cart.totalPayment);
  const { deliveryData = {} } = useSelector((state) => state.cart);
  const location = useLocation();
  const navigate = useNavigate();

  const isOrderPage = location.pathname === '/order';

  const getDeliveryPrice = (deliveryData) => {
    if (!deliveryData) return 0;

    return Object.values(deliveryData).reduce((total, sellerData) => {
      switch (sellerData?.type) {
        case 'nova-poshta':
        case 'post_box':
          return total + 120;
        case 'courier':
          return total + 135;
        case 'ukrposhta':
          return total + 80;
        default:
          return total;
      }
    }, 0);
  };

  const deliveryPrice = getDeliveryPrice(deliveryData);

  const transferOrder = () => {
    handleCheckout();
    navigate('/order');
  };

  const transferShopping = () => {
    navigate('/categories');
  };

  const finalTransfer = () => {
    navigate('/confirmation');
  };

  return (
    <section className={css.summary_section}>
      <div className={css.summarybox}>
        <div className={css.price_summary}>
          <p className={css.text_up}>
            <b>Разом</b>
          </p>
          <div className={css.wrapper}>
            <p className={css.text}>Вартість замовлення</p>
            <p className={css.text}>{totalOrderPrice} грн</p>
          </div>
          <div className={css.wrapper}>
            <p className={css.text}>Доставка</p>
            <p className={css.text}>{deliveryPrice} грн</p>
          </div>
          <hr />
          <div className={css.wrapper}>
            <p className={css.text}>
              <b>До сплати</b>
            </p>
            <p className={css.text}>
              <b>{totalOrderPrice + deliveryPrice} грн</b>
            </p>
          </div>
        </div>
        {isOrderPage ? (
          <CustomButton
            className={css.btn_order}
            size="large"
            type="button"
            onClick={finalTransfer}
            disabled={!totalOrderPrice}
          >
            Перейти до оформлення
          </CustomButton>
        ) : (
          <CustomButton
            className={css.btn_order}
            size="large"
            type="button"
            onClick={transferOrder}
            disabled={!totalOrderPrice}
          >
            Перейти до оформлення
          </CustomButton>
        )}

        {isOrderPage ? (
          <p className={css.coordination}>
            Натискаючи “Оформити замовлення” я погоджуюсь <br /> з Публічним
            договором (офертою) і обробкою персональних даних
          </p>
        ) : (
          <CustomButton
            className={css.btn}
            size="large"
            type="button"
            onClick={transferShopping}
            disabled={!totalOrderPrice}
            variant="another"
          >
            Продовжити покупки
          </CustomButton>
        )}
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
    </section>
  );
}
