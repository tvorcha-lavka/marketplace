import { NavLink } from 'react-router-dom';
import CustomButton from '../../components/CustomButton/CustomButton';
import { media } from '../../utils/mediaConfig';
import css from './ConfirmationPage.module.css';

export default function ConfirmationPage() {
  const activeClass = ({ isActive }) =>
    isActive ? `${css.active}` : `${css.navLink}`;

  const transferShopping = () => {
    navigate('/categories');
  };

  return (
    <section className={css.content}>
      <div className={css.navbox}>
        <NavLink to="/" className={activeClass}>
          Головна&nbsp;/
        </NavLink>
        <NavLink to="/cart" className={activeClass}>
          Кошик&nbsp;/
        </NavLink>
        <NavLink to="/order" className={activeClass}>
          Оформлення замовлення&nbsp;/
        </NavLink>
        <NavLink to="/confirmation" className={activeClass}>
          Пітвердження
        </NavLink>
      </div>
      <div className={css.wrapper}>
        <div className={css.infobox}>
          <p className={css.number_order}>
            Дякуємо, що обрали нас! Номер вашого замовлення
          </p>
          <p className={css.text}>Дата замовлення: 12/10/2024</p>
          <p className={css.text}>
            Незабаром на вашу електронну пошту прийде повідомлення з інформацією
            про відправлення посилки.
          </p>
        </div>
        <CustomButton
          className={css.btnContinue}
          size="custom3"
          type="button"
          variant="another"
          onClick={transferShopping}
        >
          Продовжити покупки
        </CustomButton>
        <img
          className={css.img}
          src={`${media}/cart/cart.png`}
          alt="cart"
        />
      </div>
    </section>
  );
}
