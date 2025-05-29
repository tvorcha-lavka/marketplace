import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { nextStep } from '../../../redux/cart/cartSlice';
import { selectCartItems } from '../../../redux/cart/cartSelector';

import CustomButton from '../../CustomButton/CustomButton';
import CartProduct from '../CartProduct/CartProduct';
import DeliveryResult from '../DeliveryResult/DeliveryResult';
import DeliverySelect from '../DeliverySelect/DeliverySelect';

import css from './MethodDelivery.module.css';

export default function MethodDelivery({ onDeliveryChange }) {
  const orderItems = useSelector(selectCartItems);
  const { deliveryData } = useSelector((state) => state.cart);
  const step = useSelector((state) => state.cart.step);
  const dispatch = useDispatch();

  console.log(deliveryData);

  const groupedItemsBySeller = orderItems.reduce((acc, item) => {
    if (!acc[item.seller]) {
      acc[item.seller] = [];
    }
    acc[item.seller].push(item);
    return acc;
  }, {});

  const sellers = Object.keys(groupedItemsBySeller);
  console.log(groupedItemsBySeller);

  const allSellersHaveDeliveryType = sellers.every(
    (seller) => deliveryData[seller]?.type
  );

  console.log(allSellersHaveDeliveryType);
  const [switchState, setSwitchState] = useState(
    sellers.reduce((acc, seller) => {
      acc[seller] = false;
      return acc;
    }, {})
  );

  const handleSwitchClick = (seller) => {
    const isActive = !switchState[seller];
    const firstSeller = sellers[0];
    const firstSellerData = deliveryData[firstSeller] || {};

    setSwitchState((prevState) => ({
      ...prevState,
      [seller]: isActive,
    }));

    if (isActive) {
      dispatch({
        type: 'cart/updateDeliveryData',
        payload: {
          [seller]: firstSellerData,
        },
      });
    } else {
      dispatch({
        type: 'cart/updateDeliveryData',
        payload: {
          [seller]: {},
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
      {Object.entries(groupedItemsBySeller).map(([seller, items], index) => {
        const isSwitchActive = switchState[seller];

        return (
          <div key={seller} className={css.deliverySeller}>
            <div className={css.sellerBox}>
              <p className={css.sellerName}>
                Доставка від продавця {seller}
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
                <CartProduct key={item.id} item={item} />
              ))}
            </ul>
            {step === 2 && index > 0 && (
              <div className={css.switch}>
                <div
                  className={`${css.toggle} ${isSwitchActive ? css.active : ''}`}
                  onClick={() => handleSwitchClick(seller)}
                ></div>
                <span className={css.label}>
                  Використати ті ж дані, що вище
                </span>
              </div>
            )}
            {step === 3 ? (
              <DeliveryResult seller={seller} />
            ) : (
              <DeliverySelect
                seller={seller}
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
