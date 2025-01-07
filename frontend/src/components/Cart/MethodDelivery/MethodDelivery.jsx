import { useDispatch, useSelector } from 'react-redux';
import { nextStep } from '../../../redux/cart/cartSlice';
import CustomButton from '../../CustomButton/CustomButton';
import { media } from '../../../utils/mediaConfig';
import css from './MethodDelivery.module.css';
import DeliveryResult from '../DeliveryResult/DeliveryResult';
import DeliverySelect from '../DeliverySelect/DeliverySelect';
// import CartProduct from '../CartProduct/CartProduct';

export default function MethodDelivery({ onDeliveryChange }) {
  const orderItems = useSelector((state) => state.cart.selectedItems);
  const { deliveryData } = useSelector((state) => state.cart);
  const step = useSelector((state) => state.cart.step);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (
      Object.entries(groupedItemsBySeller).every(
        ([seller]) => deliveryData[seller]?.type
      )
    ) {
      dispatch(nextStep());
    }
  };

  // Групуємо товари за продавцем

  const groupedItemsBySeller = orderItems.reduce((acc, item) => {
    if (!acc[item.seller]) {
      acc[item.seller] = [];
    }
    acc[item.seller].push(item);
    return acc;
  }, {});

  const allSellersHaveDeliveryType = Object.entries(groupedItemsBySeller).every(
    ([seller]) => deliveryData[seller]?.type
  );

  return (
    <section className={css.delivery_section}>
      {Object.entries(groupedItemsBySeller).map(([seller, items]) => {
        const quantityGoods = () => {
          if (items.length === 1) {
            return 'предмет';
          } else if (items.length > 1 || items.length < 9) {
            return 'предмети';
          } else {
            return 'предметів';
          }
        };
        return (
          <div key={seller} className={css.delivery_seller}>
            <div className={css.sellerbox}>
              <p className={css.seller_name}>
                Доставка від продавця {seller}
                <span className={css.quantity_goods}>
                  &nbsp; ({items.length} {quantityGoods()})
                </span>
              </p>
              <p className={css.seller_price}>
                {items.reduce((total, item) => total + item.price, 0)} грн
              </p>
            </div>
            <ul className={css.cart_list}>
              {items.map((item) => (
                // <CartProduct key={item.id} item={item} />
                <li className={css.cart_item} key={item.id}>
                  <img
                    className={css.item_img}
                    src={`${media}/page/404/not-found.png`}
                    alt={item.title}
                  />
                  <div className={css.item_details}>
                    <h3 className={css.item_title}>{item.title}</h3>
                    <div className={css.item_filter}>
                      <p>Розмір: {item.size}</p>
                      <p>Матеріал: {item.material}</p>
                      <p>Стан: {item.condition}</p>
                    </div>
                  </div>
                  <p className={css.item_price}>{item.price} грн</p>
                </li>
              ))}
            </ul>
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
