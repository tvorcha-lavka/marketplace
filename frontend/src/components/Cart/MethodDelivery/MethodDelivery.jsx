import { useDispatch, useSelector } from 'react-redux';
import { useState, useMemo } from 'react';

import CustomButton from '../../CustomButton/CustomButton';
import DeliveryResult from '../DeliveryResult/DeliveryResult';
import DeliverySelect from '../DeliverySelect/DeliverySelect';
import CartProduct from '../CartProduct/CartProduct';

import {
  selectBasketItems,
  selectCart,
  selectCartStep,
} from '../../../redux/basket/selectors';
import { nextStep, previousStep } from '../../../redux/basket/slice';
import { isDeliveryDataValid } from '../../../utils/cartDetails';

import css from './MethodDelivery.module.css';

export default function MethodDelivery({ onDeliveryChange }) {
  const dispatch = useDispatch();

  const orderItems = useSelector(selectBasketItems);
  const { deliveryData } = useSelector(selectCart);
  const step = useSelector(selectCartStep);

  const groupedItemsBySeller = useMemo(() => {
    return orderItems.reduce((acc, item) => {
      const ownerId = item.owner.id;
      (acc[ownerId] = acc[ownerId] || []).push(item);
      return acc;
    }, {});
  }, [orderItems]);

  const sellersWithNames = useMemo(() => {
    return Object.entries(groupedItemsBySeller).map(([ownerId, items]) => ({
      id: ownerId,
      username: items[0].owner.username,
      items,
    }));
  }, [groupedItemsBySeller]);

  const sellerIds = sellersWithNames.map(({ id }) => id);

  const isDeliveryValid = useMemo(
    () => isDeliveryDataValid(deliveryData, sellerIds),
    [deliveryData, sellerIds]
  );

  const [switchState, setSwitchState] = useState(() =>
    sellerIds.reduce((acc, ownerId) => {
      acc[ownerId] = false;
      return acc;
    }, {})
  );

  const handleSwitchClick = (ownerId) => {
    const isActive = !switchState[ownerId];
    const firstSellerId = sellerIds[0];
    const firstSellerData = deliveryData[firstSellerId] || {};

    setSwitchState((prev) => ({ ...prev, [ownerId]: isActive }));

    const payload = isActive
      ? {
        ...deliveryData,
        [ownerId]: { ...firstSellerData },
      }
      : {
        ...deliveryData,
        [ownerId]: {},
      };

    dispatch({ type: 'basket/updateDeliveryData', payload });
  };

  const handleSubmit = () => {
    if (isDeliveryValid) dispatch(nextStep());
  };

  const quantityGoods = (quantity) =>
    quantity === 1
      ? 'предмет'
      : quantity > 1 && quantity < 5
        ? 'предмети'
        : 'предметів';

  const handleEditClick = () => {
    dispatch(previousStep());
  };

  return (
    <div className={css.deliverySection}>
      {sellersWithNames.map(({ id: ownerId, username, items }, index) => {
        const isSwitchActive = switchState[ownerId];
        const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

        return (
          <div key={ownerId} className={css.deliverySeller}>
            <div className={css.sellerBox}>
              <p className={css.sellerName}>
                Доставка від продавця {username}
                <span className={css.quantityGoods}>
                  &nbsp;({items.length} {quantityGoods(items.length)})
                </span>
              </p>
              <p className={css.sellerPrice}>{totalPrice} грн</p>
            </div>

            <ul role="list">
              {items.map((item) => (
                <CartProduct
                  key={item.id}
                  item={item}
                  showSeller={false}
                  showRemoveButton={false}
                  variant="default"
                  titleBoxWidth="538px"
                  className={css.cartItemCustom}
                />
              ))}
            </ul>

            {step === 2 && index > 0 && (
              <div className={css.switch}>
                <div
                  className={`${css.toggle} ${isSwitchActive ? css.active : ''}`}
                  onClick={() => handleSwitchClick(ownerId)}
                />
                <span className={css.label}>
                  Використати ті ж дані, що вище
                </span>
              </div>
            )}

            {step === 3 ? (
              <DeliveryResult owner={ownerId} onEdit={handleEditClick} />
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
          disabled={!isDeliveryValid}
        >
          Продовжити
        </CustomButton>
      )}
    </div>
  );
}
