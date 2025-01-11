import { Link } from 'react-router-dom';
import { LiaEditSolid } from 'react-icons/lia';
import { useSelector } from 'react-redux';
import css from './SelectedProducts.module.css';
import CartProduct from '../CartProduct/CartProduct';
import { selectCartItems } from '../../../redux/cart/cartSelector';

export default function SelectedProducts() {
  const orderItems = useSelector(selectCartItems);

  return (
    <section className={css.ordershopping_section}>
      <div className={css.goods_edit}>
        <p className={css.quantity_goods}>Ваш кошик ({orderItems.length})</p>
        <Link to="/cart" className={css.editbox}>
          <p className={css.edit}>Редагувати</p>
          <LiaEditSolid size={16} />
        </Link>
      </div>
      <div className={css.scrollbox}>
        <div className={css.scrollbox_inner}>
          <ul className={css.cart_list}>
            {orderItems.map((item) => (
              <CartProduct key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
