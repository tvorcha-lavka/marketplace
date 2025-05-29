import { Link } from 'react-router-dom';
import { LiaEditSolid } from 'react-icons/lia';
import { useSelector } from 'react-redux';

import CartProduct from '../CartProduct/CartProduct';

import { selectCartItems } from '../../../redux/cart/cartSelector';

import css from './SelectedProducts.module.css';

export default function SelectedProducts() {
  const orderItems = useSelector(selectCartItems);

  return (
    <div className={css.orderShoppingSection}>
      <div className={css.goodsEdit}>
        <p className={css.quantityGoods}>Ваш кошик ({orderItems.length})</p>
        <Link to="/cart" className={css.editBox}>
          <p className={css.edit}>Редагувати</p>
          <LiaEditSolid size={16} />
        </Link>
      </div>
      <div className='scrollBox'>
        <div className='scrollBoxInner'>
          <ul className={css.cartList}>
            {orderItems.map((item) => (
              <CartProduct key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
