import { NavLink } from 'react-router-dom';
import RecommendedCards from '../../components/RecommendedCards/RecommendedCards';
import ShoppingCart from '../../components/Cart/ShoppingCart/ShoppingCart';
import SummaryCart from '../../components/Cart/SummaryCart/SummaryCart';
import css from './CartPage.module.css';

export default function CartPage() {
  const activeClass = ({ isActive }) =>
    isActive ? `${css.active}` : `${css.navLink}`;

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
        <SummaryCart />
      </div>
      <RecommendedCards />
    </div>
  );
}
