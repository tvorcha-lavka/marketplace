import { NavLink } from 'react-router-dom';
import CustomerData from '../../components/Cart/CustomerData/CustomerData';
import MethodDelivery from '../../components/Cart/MethodDelivery/MethodDelivery';
import MethodPayment from '../../components/Cart/MethodPayment/MethodPayment';
import SelectedProducts from '../../components/Cart/SelectedProducts/SelectedProducts';
import SummaryCart from '../../components/Cart/SummaryCart/SummaryCart';
import css from './PlaceOrderPage.module.css';

export default function PlaceOrder() {
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
          <CustomerData />
          <MethodDelivery />
          <MethodPayment />
        </div>
        <div className={css.wrapper}>
          <SelectedProducts />
          <SummaryCart />
        </div>
      </div>
    </div>
  );
}
