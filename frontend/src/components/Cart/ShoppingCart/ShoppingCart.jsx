import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineDelete } from 'react-icons/ai';
import {
  removeItem,
  toggleSelectItem,
  toggleSelectAll,
} from '../../../redux/cart/cartSlice';
import { selectCartItems } from '../../../redux/cart/cartSelector';
import { media } from '../../../utils/mediaConfig';
import css from './ShoppingCart.module.css';

export default function ShoppingCart() {
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
        <span className={css.span_title}>&nbsp;({cartItems.length})</span>
      </h3>
      <div className={css.selectAll}>
        <input
          type="checkbox"
          className={css.checkbox}
          checked={allSelected}
          onChange={handleSelectAll}
        />
        <p className={css.select_text}>Виділити все</p>
      </div>
      <div className={css.scrollbox}>
        <div className={css.scrollbox_inner}>
          <ul className={css.cart_list}>
            {cartItems.map((item) => (
              <li key={item.id} className={css.cart_item}>
                <input
                  type="checkbox"
                  className={css.checkbox}
                  checked={item.selected}
                  onChange={() => dispatch(toggleSelectItem(item.id))}
                />
                <img
                  className={css.item_img}
                  src={`${media}/page/404/not-found.png`}
                  alt={item.title}
                />
                <div className={css.item_details}>
                  <h3 className={css.item_title}>{item.title}</h3>
                  <p className={css.item_seller}>
                    Продавець:
                    <span className={css.seller_name}>{item.seller}</span>
                  </p>
                  <div className={css.item_filter}>
                    <p>Розмір: {item.size}</p>
                    <p>Матеріал: {item.material}</p>
                    <p>Стан: {item.condition}</p>
                  </div>
                </div>
                <p className={css.item_price}>{item.price} грн</p>
                <button
                  className={css.remove_btn}
                  type="button"
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  <AiOutlineDelete color="red" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
