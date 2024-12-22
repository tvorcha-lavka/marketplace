import { useDispatch, useSelector } from 'react-redux';
import { updateDeliveryData, nextStep } from '../../../redux/cart/cartSlice';
import CustomButton from '../../CustomButton/CustomButton';
import { media } from '../../../utils/mediaConfig';
import css from './MethodDelivery.module.css';

export default function MethodDelivery() {
  const orderItems = useSelector((state) => state.cart.selectedItems);
  console.log(orderItems);
  const dispatch = useDispatch();
  const { deliveryData } = useSelector((state) => state.cart);

  const handleDeliveryTypeChange = (type) => {
    switch (type) {
      case 'nova-poshta':
        {
          dispatch(
            updateDeliveryData({
              type: 'nova-poshta',
              city: 'Київ',
              branch: '7',
            })
          );
        }
        break;
      case 'post_box':
        {
          dispatch(
            updateDeliveryData({
              type: 'nova-poshta',
              address: 'asdgfgh',
            })
          );
        }
        break;
      case 'courier':
        {
          dispatch(
            updateDeliveryData({
              type: 'nova-poshta',
              address: 'asdgfgh',
            })
          );
        }
        break;
      case 'ukrposhta':
        {
          dispatch(
            updateDeliveryData({
              type: 'nova-poshta',
              address: 'asdgfgh',
            })
          );
        }
        break;
      default:
    }
  };

  const handleSubmit = () => {
    dispatch(updateDeliveryData({ type: 'nova-poshta', city: 'Київ' }));
    dispatch(nextStep());
  };

  return (
    <section className={css.delivery_section}>
      <div className={css.dellivery_seller}>
        <div className={css.sellerbox}>
          <p className={css.seller_name}>
            Доставка від продавця Lesia_OK12
            <span className={css.quantity_goods}>(2 предмети)</span>
          </p>
          <p className={css.seller_price}>1200 грн</p>
        </div>
        <ul className={css.cart_list}>
          {orderItems.map((item) => (
            <li className={css.cart_item} key={item.id}>
              <img
                className={css.item_img}
                src={`${media}/page/404/not-found.png`}
                alt="Item 1"
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
        <ul>
          <li className={css.deliveryItem}>
            <div className={css.deliveryOption}>
              <input
                id="nova-poshta"
                type="radio"
                name="deliveryData"
                value="nova-poshta"
                checked={deliveryData.type === 'nova-poshta'}
                onChange={() => handleDeliveryTypeChange('nova-poshta')}
              />
              <label htmlFor="nova-poshta" className={css.deliveryOption}>
                Доставка Нова Пошта у відділення
              </label>
            </div>
            <p>від 120 грн</p>
            {deliveryData.type === 'nova-poshta' && (
              <div className={css.deliveryDetails}>
                <input
                  type="text"
                  placeholder="Місто"
                  value={deliveryData.city}
                  onChange={(e) =>
                    handleInputChange('city', e.target.value, 'deliveryData')
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Відділення"
                  value={deliveryData.branch}
                  onChange={(e) =>
                    handleInputChange('branch', e.target.value, 'deliveryData')
                  }
                  required
                />
              </div>
            )}
          </li>

          <li className={css.deliveryItem}>
            <div className={css.deliveryOption}>
              <input
                type="radio"
                id="post_box"
                name="deliveryData"
                value="post_box"
                checked={deliveryData.type === 'post_box'}
                onChange={() => handleDeliveryTypeChange('post_box')}
              />
              <label htmlFor="post_box">Доставка Нова Пошта у поштомат</label>
            </div>
            <p>від 120 грн</p>
            {deliveryData.type === 'post_box' && (
              <div className={css.deliveryDetails}>
                <input
                  type="text"
                  placeholder="Адреса"
                  value={deliveryData.address}
                  onChange={(e) =>
                    handleInputChange('address', e.target.value, 'deliveryData')
                  }
                  required
                />
              </div>
            )}
          </li>
          <li className={css.deliveryItem}>
            <div className={css.deliveryOption}>
              <input
                type="radio"
                id="courier"
                name="deliveryData"
                value="courier"
                checked={deliveryData.type === 'courier'}
                onChange={() => handleDeliveryTypeChange('courier')}
              />
              <label htmlFor="courier">Доставка курʼєром Нова Пошта</label>
            </div>
            <p>від 135 грн</p>
            {deliveryData.type === 'courier' && (
              <div className={css.deliveryDetails}>
                <input
                  type="text"
                  placeholder="Адреса"
                  value={deliveryData.address}
                  onChange={(e) =>
                    handleInputChange('address', e.target.value, 'deliveryData')
                  }
                  required
                />
              </div>
            )}
          </li>
          <li className={css.deliveryItem}>
            <div className={css.deliveryOption}>
              <input
                type="radio"
                id="ukrposhta"
                name="deliveryData"
                value="ukrposhta"
                checked={deliveryData.type === 'ukrposhta'}
                onChange={() => handleDeliveryTypeChange('ukrposhta')}
              />
              <label htmlFor="ukrposhta">Доставка Укрпошта у відділення</label>
            </div>
            <p>від 80 грн</p>
            {deliveryData.type === 'ukrposhta' && (
              <div className={css.deliveryDtails}>
                <input
                  type="text"
                  placeholder="Адреса"
                  value={deliveryData.address}
                  onChange={(e) =>
                    handleInputChange('address', e.target.value, 'deliveryData')
                  }
                  required
                />
              </div>
            )}
          </li>
        </ul>
      </div>
      <CustomButton
        className={css.btnContinue}
        size="small"
        type="submit"
        onClick={handleSubmit}
        // disabled={!isButtonEnabled}
      >
        Продовжити
      </CustomButton>
    </section>
  );
}
