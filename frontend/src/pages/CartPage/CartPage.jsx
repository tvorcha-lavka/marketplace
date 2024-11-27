import { NavLink } from 'react-router-dom';
import RecommendedCards from '../../components/RecommendedCards/RecommendedCards';
import CartAndSummary from '../../components/Cart/CartAndSummary/CartAndSummary';
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
      <CartAndSummary />
      <RecommendedCards />
    </div>
  );
}
