import { useSelector } from 'react-redux';

import CartProduct from '../CartProduct/CartProduct';

import { selectCartItems } from '../../../redux/cart/cartSelector';

import css from './ShoppingCart.module.css';

export default function ShoppingCart() {
  const cartItems = useSelector(selectCartItems);

  return (
    <div className={css.shoppingBox}>
      <h3 className={css.title}>
        Предмети у вашому кошику
        <span>&nbsp;({cartItems.length})</span>
      </h3>

      <div className="scrollBox">
        <div className="scrollBoxInner">
          <ul className={css.cartList}>
            {cartItems.map((item) => (
              <CartProduct key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
