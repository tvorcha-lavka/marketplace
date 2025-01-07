import { useDispatch, useSelector } from 'react-redux';
import CartProduct from '../CartProduct/CartProduct';
import { toggleSelectAll } from '../../../redux/cart/cartSlice';
import { selectCartItems } from '../../../redux/cart/cartSelector';
import { selectBasketItems } from '../../../redux/basket/selectors';
import css from './ShoppingCart.module.css';

export default function ShoppingCart() {
  const basketItems = useSelector(selectBasketItems);
  console.log(basketItems);
  const cartItems = useSelector(selectCartItems);
  const allSelected = cartItems.every((item) => item.selected);
  const dispatch = useDispatch();

  const handleSelectAll = () => {
    dispatch(toggleSelectAll(!allSelected));
  };

  return (
    <div className={css.shoppingbox}>
      <h3 className={css.title}>
        Предмети у вашому кошику
        <span>&nbsp;({cartItems.length})</span>
      </h3>
      <div className={css.selectAll}>
        <input
          type="checkbox"
          className={css.checkbox}
          checked={allSelected}
          onChange={handleSelectAll}
        />
        <p>Виділити все</p>
      </div>
      <div className={css.scrollbox}>
        <div className={css.scrollbox_inner}>
          <ul className={css.cart_list}>
            {cartItems.map((item) => (
              <CartProduct key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
