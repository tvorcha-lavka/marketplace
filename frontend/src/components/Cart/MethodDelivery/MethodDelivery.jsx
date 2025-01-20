import { useDispatch, useSelector } from 'react-redux';
import { nextStep } from '../../../redux/cart/cartSlice';
import CustomButton from '../../CustomButton/CustomButton';
import CartProduct from '../CartProduct/CartProduct';
import DeliveryResult from '../DeliveryResult/DeliveryResult';
import DeliverySelect from '../DeliverySelect/DeliverySelect';
import { selectCartItems } from '../../../redux/cart/cartSelector';
import css from './MethodDelivery.module.css';
import { useState } from 'react';

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

  // const allSellersHaveDeliveryType = Object.entries(groupedItemsBySeller).every(
  //   ([seller]) => deliveryData[seller]?.type
  // );
  const allSellersHaveDeliveryType = sellers.every(
    (seller) => deliveryData[seller]?.type
  );

  console.log(allSellersHaveDeliveryType);
  const [switchState, setSwitchState] = useState(
    sellers.reduce((acc, seller) => {
      acc[seller] = false; // Всі перемикачі вимкнені за замовчуванням
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
      // Копіюємо дані з першого продавця
      dispatch({
        type: 'cart/updateDeliveryData',
        payload: {
          [seller]: firstSellerData,
        },
      });
    } else {
      // Очищуємо дані для поточного продавця
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
    <section className={css.delivery_section}>
      {Object.entries(groupedItemsBySeller).map(([seller, items], index) => {
        const isSwitchActive = switchState[seller];

        return (
          <div key={seller} className={css.delivery_seller}>
            <div className={css.sellerbox}>
              <p className={css.seller_name}>
                Доставка від продавця {seller}
                <span className={css.quantity_goods}>
                  &nbsp; ({items.length} {quantityGoods(items.length)})
                </span>
              </p>
              <p className={css.seller_price}>
                {items.reduce((total, item) => total + item.price, 0)} грн
              </p>
            </div>
            <ul className={css.cart_list}>
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
    </section>
  );
}
