import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import RecommendedCards from '../../components/RecommendedCards/RecommendedCards';
import ShoppingCart from '../../components/Cart/ShoppingCart/ShoppingCart';
import SummaryCart from '../../components/Cart/SummaryCart/SummaryCart';
import css from './CartPage.module.css';

export default function CartPage() {
  const totalOrderPrice = useSelector((state) => state.cart.totalPayment);
  const selectedItems = useSelector((state) => state.cart.selectedItems);
  const navigate = useNavigate();
  const activeClass = ({ isActive }) =>
    isActive ? `${css.active}` : `${css.navLink}`;

  const handleCheckout = () => {
    localStorage.setItem('orderItems', JSON.stringify(selectedItems));
    localStorage.setItem('totalPayment', JSON.stringify(totalOrderPrice));
    navigate('/order');
  };

  return (
    <div className={css.cart_container}>
      <div className={css.navbox}>
        <NavLink to="/" className={css.navLink}>
          Головна /
        </NavLink>
        <NavLink to="/cart" className={activeClass}>
          Кошик
        </NavLink>
      </div>
      <div className={css.cartAndSummary}>
        <ShoppingCart />
        <SummaryCart
          totalOrderPrice={totalOrderPrice}
          handleCheckout={handleCheckout}
        />
      </div>
      <RecommendedCards />
    </div>
  );
}
