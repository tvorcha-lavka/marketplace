import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { LuTrash } from 'react-icons/lu';

import { removeFromBasket } from '../../../redux/basket/slice';
import { media } from '../../../utils/mediaConfig';
import { getFilters } from '../../../utils/filtersDB';

import css from './CartProduct.module.css';

export default function CartProduct({
  item,
  showSeller = true,
  showRemoveButton = false,
  variant = 'default', // 'default' | 'shop'
  className = '',
  titleBoxWidth,
}) {
  const [filters, setFilters] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!item?.id) return;

    getFilters(item.id).then((savedFilters) => {
      setFilters(savedFilters);
    });
  }, [item?.id]);

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

  const isShop = variant === 'shop';

  return (
    <li key={item.id} className={className}>
      <img
        className={isShop ? css.itemImgShop : css.itemImg}
        src={imagesSmall?.[0]?.url || `${media}/defaults/no-image.jpg`}
        alt={item.title}
      />
      <div>
        <div
          className={css.titleBox}
          style={titleBoxWidth ? { width: titleBoxWidth } : {}}
        >
          <h3 className={isShop ? css.itemTitleShop : css.itemTitle}>
            {item.title}
          </h3>
          <p className={isShop ? css.itemPriceShop : css.itemPrice}>
            {item.price}&nbsp;грн
          </p>

          {showRemoveButton && (
            <button
              className={`${css.trashBtn} ${isShop ? css.trashBtnShop : css.trashBtnDefault}`}
              type="button"
              onClick={() => handleRemoveItem(item.id)}
            >
              <LuTrash className={css.trashIcon} />
            </button>
          )}
        </div>

        {showSeller && (
          <p className={isShop ? css.itemSellerShop : css.itemSeller}>
            Продавець:&nbsp;
            <span className={css.sellerName}>{item.owner.username}</span>
          </p>
        )}

        <ul className={isShop ? css.itemFilterShop : css.itemFilter}>
          {filters.map((value) => (
            <li key={value.title} className={css.filtersItem}>
              <p>
                {value.title}:&nbsp;{value.value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
