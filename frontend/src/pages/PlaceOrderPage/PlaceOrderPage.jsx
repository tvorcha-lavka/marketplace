import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CustomerData from '../../components/Cart/CustomerData/CustomerData';
import MethodDelivery from '../../components/Cart/MethodDelivery/MethodDelivery';
import MethodPayment from '../../components/Cart/MethodPayment/MethodPayment';
import SelectedProducts from '../../components/Cart/SelectedProducts/SelectedProducts';
import SummaryCart from '../../components/Cart/SummaryCart/SummaryCart';
import { selectCartStep } from '../../redux/cart/cartSelector';
import css from './PlaceOrderPage.module.css';

export default function PlaceOrder() {
  const step = useSelector(selectCartStep);
  const activeClass = ({ isActive }) =>
    isActive ? `${css.active}` : `${css.navLink}`;

  return (
    <div className={css.order_container}>
      <div className={css.navbox}>
        <NavLink to="/" className={activeClass}>
          Головна /
        </NavLink>
        <NavLink to="/cart" className={activeClass}>
          Кошик /
        </NavLink>
        <NavLink to="/order" className={activeClass}>
          Оформлення замовлення
        </NavLink>
      </div>
      <div className={css.orderbox}>
        <div className={css.wrapper}>
          <div className={css.databox}>
            {(step === 1 || step === 2 || step === 3) && <CustomerData />}
          </div>
          <div className={css.deliverybox}>
            <h2 className={css.title}>2. Спосіб доставки</h2>
            {(step === 2 || step === 3) && <MethodDelivery />}
          </div>
          <div className={css.paymentbox}>
            <h2 className={css.title}>3. Спосіб оплати</h2>
            {step === 3 && <MethodPayment />}
          </div>
        </div>
        <div className={css.wrapper}>
          <SelectedProducts />
          <SummaryCart />
        </div>
      </div>
    </div>
  );
}
