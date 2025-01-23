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
      className={isCartPage ? `${css.cartItemShop}` : `${css.cartItem}`}
    >
      <img
        className={isCartPage ? `${css.itemImgShop}` : `${css.itemImg}`}
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
          className={isCartPage ? `${css.itemTitleShop}` : `${css.itemTitle}`}
        >
          {item.title}
        </h3>
        {isCartPage && (
          <p className={css.itemSeller}>
            Продавець:&nbsp;
            <span className={css.sellerName}>{item.seller}</span>
          </p>
        )}
        <div
          className={isCartPage ? `${css.itemFilterShop}` : `${css.itemFilter}`}
        >
          <p>Розмір: {item.size}</p>
          <p>Матеріал: {item.material}</p>
          <p>Стан: {item.condition}</p>
        </div>
      </div>
      <p className={isCartPage ? `${css.itemPriceShop}` : `${css.itemPrice}`}>
        {item.price}&nbsp;грн
      </p>
      {isCartPage && (
        <button
          className={css.removeBtn}
          type="button"
          onClick={() => dispatch(removeItem(item.id))}
        >
          <AiOutlineDelete color="red" />
        </button>
      )}
    </li>
  );
}
