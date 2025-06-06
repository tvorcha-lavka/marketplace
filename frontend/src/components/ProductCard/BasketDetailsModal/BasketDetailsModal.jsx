import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LuTrash } from 'react-icons/lu';
import { nanoid } from 'nanoid';

import CustomButton from '../../CustomButton/CustomButton';
import EmptyCartMessage from '../../Cart/EmptyCartMessage/EmptyCartMessage';

import {
  selectTotal,
  selectBasketItems,
} from '../../../redux/basket/selectors';
import { removeFromBasket } from '../../../redux/basket/slice';
import { media } from '../../../utils/mediaConfig';

import css from './BasketDetailsModal.module.css';

export default function BasketDetailsModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectBasketItems);
  const total = useSelector(selectTotal);

  const transferOrder = () => {
    navigate('/order');
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromBasket({ id: itemId }));
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <EmptyCartMessage />
      ) : (
        <>
          <h4 className={css.trashListTitle}>
            Ваш кошик ({cartItems.length} предмети)
          </h4>

          <ul className={`${css.scrollContainer} scrollBox scrollBoxInner`}>
            {cartItems.map((item) => {
              const uniqueId = nanoid();

              const images = item.images || [];
              const processedImages = images.flatMap(
                (image) => image?.processed_images || []
              );
              const imagesSmall = processedImages.filter(
                (image) => image?.height === 200 && image?.width === 150
              );

              return (
                <li className={css.productList} key={uniqueId}>
                  <div>
                    <img
                      src={
                        imagesSmall?.[0]?.url ||
                        `${media}/defaults/no-image.jpg`
                      }
                      alt={item.title}
                      className={css.img}
                    />
                  </div>

                  <div className={css.ownerContainer}>
                    <h2 className={css.productTitle}>{item.title}</h2>
                    <h3 className={css.owner}>
                      Продавець:&nbsp;
                      <span className={css.ownerName}>
                        {item.owner.username}
                      </span>
                    </h3>

                    <div className={css.filterInfo}>
                      <p>Розмір: ...</p>
                      <p>Матеріал: ...</p>
                      <p>Стан: ...</p>
                    </div>

                    <div className={css.priceContainer}>
                      <p className={css.price}>
                        {parseFloat(item.price).toFixed(2)}&nbsp;грн
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className={css.trashBtn}
                      >
                        <LuTrash className={css.trashIcon} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className={css.priceSummary}>
            Разом: {typeof total === 'number' ? total.toFixed(2) : '0.00'} грн.
          </p>

          <CustomButton
            onClick={transferOrder}
            variant="default"
            size="large"
            className={css.orderBtn}
          >
            Перейти до оформлення
          </CustomButton>
        </>
      )}
    </>
  );
}
