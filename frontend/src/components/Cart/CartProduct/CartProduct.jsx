import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { LuTrash } from 'react-icons/lu';

import { removeFromBasket } from '../../../redux/basket/slice';
import { media } from '../../../utils/mediaConfig';

import css from './CartProduct.module.css';

export default function CartProduct({ item }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const isCartPage = location.pathname === '/cart';

  const images = item.images || [];
  const processedImages = images.flatMap(
    (image) => image?.processed_images || []
  );
  const imagesSmall = processedImages.filter(
    (image) => image?.height === 200 && image?.width === 150
  );

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromBasket({ id: itemId }));
  };

  return (
    <li
      key={item.id}
      className={isCartPage ? `${css.cartItemShop}` : `${css.cartItem}`}
    >
      <img
        className={isCartPage ? `${css.itemImgShop}` : `${css.itemImg}`}
        src={imagesSmall?.[0]?.url || `${media}/defaults/no-image.jpg`}
        alt={item.title}
      />
      <div>
        <div className={isCartPage ? `${css.titleBoxShop}` : `${css.titleBox}`}>
          <h3
            className={isCartPage ? `${css.itemTitleShop}` : `${css.itemTitle}`}
          >
            {item.title}
          </h3>
          <p
            className={isCartPage ? `${css.itemPriceShop}` : `${css.itemPrice}`}
          >
            {item.price}&nbsp;грн
          </p>
          {isCartPage && (
            <button
              className={css.trashBtn}
              type="button"
              onClick={() => handleRemoveItem(item.id)}
            >
              <LuTrash className={css.trashIcon} />
            </button>
          )}
        </div>
        <p
          className={isCartPage ? `${css.itemSellerShop}` : `${css.itemSeller}`}
        >
          Продавець:&nbsp;
          <span className={css.sellerName}>{item.owner.username}</span>
        </p>

        <div
          className={isCartPage ? `${css.itemFilterShop}` : `${css.itemFilter}`}
        >
          <p>Розмір: ...</p>
          <p>Матеріал: ...</p>
          <p>Стан: ...</p>
        </div>
      </div>
    </li>
  );
}
