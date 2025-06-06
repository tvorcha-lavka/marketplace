import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import CustomButton from '../../CustomButton/CustomButton';
import DeliveryResult from '../DeliveryResult/DeliveryResult';
import DeliverySelect from '../DeliverySelect/DeliverySelect';

import {
  selectBasketItems,
  selectCart,
  selectCartStep,
} from '../../../redux/basket/selectors';
import { nextStep } from '../../../redux/basket/slice';
import { media } from '../../../utils/mediaConfig';

import css from './MethodDelivery.module.css';

export default function MethodDelivery({ onDeliveryChange }) {
  const dispatch = useDispatch();

  const orderItems = useSelector(selectBasketItems);
  const { deliveryData } = useSelector(selectCart);
  const step = useSelector(selectCartStep);

  const groupedItemsBySeller = orderItems.reduce((acc, item) => {
    const ownerId = item.owner.id;
    if (!acc[ownerId]) {
      acc[ownerId] = [];
    }
    acc[ownerId].push(item);
    return acc;
  }, {});

  const sellerIds = Object.keys(groupedItemsBySeller);

  const sellersWithNames = sellerIds.map((ownerId) => {
    const items = groupedItemsBySeller[ownerId];
    return {
      id: ownerId,
      username: items[0].owner.username,
      items,
    };
  });

  const allSellersHaveDeliveryType = sellerIds.every(
    (ownerId) => deliveryData[ownerId]?.type
  );

  const [switchState, setSwitchState] = useState(
    sellerIds.reduce((acc, ownerId) => {
      acc[ownerId] = false;
      return acc;
    }, {})
  );

  const handleSwitchClick = (ownerId) => {
    const isActive = !switchState[ownerId];
    const firstSellerId = sellerIds[0];
    const firstSellerData = deliveryData[firstSellerId] || {};

    setSwitchState((prevState) => ({
      ...prevState,
      [ownerId]: isActive,
    }));

    if (isActive) {
      dispatch({
        type: 'basket/updateDeliveryData',
        payload: {
          [ownerId]: firstSellerData,
        },
      });
    } else {
      dispatch({
        type: 'basket/updateDeliveryData',
        payload: {
          ...deliveryData,
          [ownerId]: {},
        },
      });
    }
  };

  const handleSubmit = () => {
    if (allSellersHaveDeliveryType) {
      dispatch(nextStep());
    }
  };

  const quantityGoods = (quantity) => {
    if (quantity === 1) return 'предмет';
    if (quantity > 1 && quantity < 5) return 'предмети';
    return 'предметів';
  };

  return (
    <div className={css.deliverySection}>
      {sellersWithNames.map(({ id: ownerId, username, items }, index) => {
        const isSwitchActive = switchState[ownerId];

        return (
          <div key={ownerId} className={css.deliverySeller}>
            <div className={css.sellerBox}>
              <p className={css.sellerName}>
                Доставка від продавця {username}
                <span className={css.quantityGoods}>
                  &nbsp; ({items.length} {quantityGoods(items.length)})
                </span>
              </p>
              <p className={css.sellerPrice}>
                {items.reduce((total, item) => total + item.price, 0)} грн
              </p>
            </div>

            <ul className={css.cartList}>
              {items.map((item) => (
                <li key={item.id} className={css.cartItem}>
                  <img
                    className={css.itemImg}
                    src={
                      item.imagesSmall?.[0]?.url ||
                      `${media}/defaults/no-image.jpg`
                    }
                    alt={item.title}
                  />
                  <div>
                    <div className={css.titleBox}>
                      <h3 className={css.itemTitle}>{item.title}</h3>
                      <p className={css.itemPrice}>{item.price}&nbsp;грн</p>
                    </div>
                    <div className={css.itemFilter}>
                      <p>Розмір: ...</p>
                      <p>Матеріал: ...</p>
                      <p>Стан: ...</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {step === 2 && index > 0 && (
              <div className={css.switch}>
                <div
                  className={`${css.toggle} ${isSwitchActive ? css.active : ''}`}
                  onClick={() => handleSwitchClick(ownerId)}
                ></div>
                <span className={css.label}>
                  Використати ті ж дані, що вище
                </span>
              </div>
            )}
            {step === 3 ? (
              <DeliveryResult owner={ownerId} />
            ) : (
              <DeliverySelect
                owner={ownerId}
                onDeliveryChange={onDeliveryChange}
              />
            )}
          </div>
        );
      })}
      {step === 2 && (
        <CustomButton
          className={css.btnContinue}
          size="small"
          type="submit"
          onClick={handleSubmit}
          disabled={!allSellersHaveDeliveryType}
        >
          Продовжити
        </CustomButton>
      )}
    </div>
  );
}
