import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
import { removeItem } from '../../../redux/cart/cartSlice';
import { media } from '../../../utils/mediaConfig';
import css from './CartProduct.module.css';

export default function CartProduct({ item }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const isCartPage = location.pathname === '/cart';

  return (
    <li
      key={item.id}
      className={isCartPage ? `${css.cart_item_shop}` : `${css.cart_item}`}
    >
      <img
        className={isCartPage ? `${css.item_img_shop}` : `${css.item_img}`}
        src={
          // item.images?.[0]?.s_image_url
          //   ? item.images[0].s_image_url
          //   :
          `${media}/page/404/not-found.png`
        }
        alt={item.title}
      />
      <div>
        <h3
          className={
            isCartPage ? `${css.item_title_shop}` : `${css.item_title}`
          }
        >
          {item.title}
        </h3>
        {isCartPage && (
          <p className={css.item_seller}>
            Продавець:&nbsp;
            <span className={css.seller_name}>{item.seller}</span>
          </p>
        )}
        <div
          className={
            isCartPage ? `${css.item_filter_shop}` : `${css.item_filter}`
          }
        >
          <p>Розмір: {item.size}</p>
          <p>Матеріал: {item.material}</p>
          <p>Стан: {item.condition}</p>
        </div>
      </div>
      <p
        className={isCartPage ? `${css.item_price_shop}` : `${css.item_price}`}
      >
        {item.price}&nbsp;грн
      </p>
      {isCartPage && (
        <button
          className={css.remove_btn}
          type="button"
          onClick={() => dispatch(removeItem(item.id))}
        >
          <AiOutlineDelete color="red" />
        </button>
      )}
    </li>
  );
}
