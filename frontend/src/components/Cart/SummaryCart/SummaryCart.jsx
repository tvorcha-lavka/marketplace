import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsShieldFillExclamation } from 'react-icons/bs';

import CustomButton from '../../CustomButton/CustomButton';

import { media } from '../../../utils/mediaConfig';
import {
  selectTotal,
  selectCart,
  selectBasketItems,
} from '../../../redux/basket/selectors';

import css from './SummaryCart.module.css';

export default function SummaryCart({ isClickBtn }) {
  const totalOrderPrice = useSelector(selectTotal);
  const { deliveryData } = useSelector(selectCart);
  const items = useSelector(selectBasketItems);
  const isCartEmpty = items.length === 0;

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
    navigate('/order');
  };

  const transferShopping = () => {
    navigate('/categories');
  };

  const finalTransfer = () => {
    navigate('/confirmation');
  };

  return (
    <div className={css.summarySection}>
      <div className={css.summarybox}>
        <div className={css.priceSummary}>
          <p className={css.textUp}>Разом</p>
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
            <p className={css.textUp}>До сплати</p>
            <p className={css.text}>
              <b>{totalOrderPrice + deliveryPrice} грн</b>
            </p>
          </div>
        </div>

        {isOrderPage ? (
          <CustomButton
            className={css.btnOrder}
            size="large"
            type="button"
            onClick={finalTransfer}
            disabled={!isClickBtn}
          >
            Оформити замовлення
          </CustomButton>
        ) : (
          <CustomButton
            className={css.btnOrder}
            size="large"
            type="button"
            onClick={transferOrder}
            disabled={isCartEmpty}
          >
            Перейти до оформлення
          </CustomButton>
        )}

        {isOrderPage ? (
          <p className={css.coordination}>
            Натискаючи &#8220;Оформити замовлення&#8221; я погоджуюсь <br /> з
            Публічним договором (офертою) і обробкою персональних даних
          </p>
        ) : (
          <CustomButton
            className={css.btn}
            size="large"
            type="button"
            onClick={transferShopping}
            variant="another"
          >
            Продовжити покупки
          </CustomButton>
        )}
      </div>
      <div className={css.infobox}>
        <BsShieldFillExclamation size={24} />
        <div>
          <p className={css.infoText}>
            Ви купуєте з послугою &#8220;Безпечна угода&#8221;
          </p>
          <Link className={css.infoLink}>Більше деталей</Link>
        </div>
      </div>
      <div className={css.paymentInfobox}>
        <p className={css.paymentInfo}>Способи оплати:&nbsp;</p>
        <img
          className={css.liqpayLogo}
          src={`${media}/logo/logo_liqpay.svg`}
          alt="Liqpay logotype"
        />
      </div>
    </div>
  );
}
