import { media } from '../../../utils/mediaConfig';
import css from './MethodDelivery.module.css';

export default function MethodDelivery() {
  return (
    <section className={css.delivery_section}>
      <h2 className={css.title}>2. Спосіб доставки</h2>
      <div className={css.dellivery_seller}>
        <div className={css.sellerbox}>
          <p className={css.seller_name}>
            Доставка від продавця Lesia_OK12
            <span className={css.quantity_goods}>(2 предмети)</span>
          </p>
          <p className={css.seller_price}>1200 грн</p>
        </div>
        <ul className={css.cart_list}>
          <li className={css.cart_item}>
            <img
              className={css.item_img}
              src={`${media}/page/404/not-found.png`}
              alt="Item 1"
            />
            <div className={css.item_details}>
              <h3 className={css.item_title}>
                Українська традиційна вишиванка жінoча Львівська
              </h3>
              <div className={css.item_filter}>
                <p>Розмір: M</p>
                <p>Матеріал: Льон</p>
                <p>Стан: Новий</p>
              </div>
            </div>
            <p className={css.item_price}>599 грн</p>
          </li>
          <li className={css.cart_item}>
            <img
              className={css.item_img}
              src={`${media}/page/404/not-found.png`}
              alt="Item 1"
            />
            <div className={css.item_details}>
              <h3 className={css.item_title}>
                Українська традиційна вишиванка жінoча Львівська
              </h3>
              <div className={css.item_filter}>
                <p>Розмір: M</p>
                <p>Матеріал: Льон</p>
                <p>Стан: Новий</p>
              </div>
            </div>
            <p className={css.item_price}>599 грн</p>
          </li>
        </ul>
        <ul>
          <li className={css.delivery_item}>
            <div className={css.delivery_option}>
              <input
                id="nova-poshta"
                type="radio"
                name="delivery"
                value="nova-poshta"
                // checked={delivery.type === 'nova-poshta'}
                // onChange={() => handleDeliveryTypeChange('nova-poshta')}
              />
              <label htmlFor="nova-poshta" className={css.delivery_option}>
                Доставка Нова Пошта у відділення
              </label>
            </div>
            <p>від 120 грн</p>
            {/* {delivery.type === 'nova-poshta' && (
        <div className={css.delivery-details}>
          <input
            type="text"
            placeholder="Місто"
            value={delivery.city}
            onChange={(e) =>
              handleInputChange('city', e.target.value, 'delivery')
            }
            required
          />
          <input
            type="text"
            placeholder="Відділення"
            value={delivery.branch}
            onChange={(e) =>
              handleInputChange('branch', e.target.value, 'delivery')
            }
            required
          />
        </div>
        )} */}
          </li>

          <li className={css.delivery_item}>
            <div className={css.delivery_option}>
              <input
                type="radio"
                id="post_box"
                name="delivery"
                value="post_box"
                // checked={delivery.type === 'post_box'}
                // onChange={() => handleDeliveryTypeChange('post_box')}
              />
              <label htmlFor="post_box">Доставка Нова Пошта у поштомат</label>
            </div>
            <p>від 120 грн</p>
            {/* {delivery.type === 'post_box' && (
          <div className={css.delivery-details}>
            <input
              type="text"
              placeholder="Адреса"
              value={delivery.address}
              onChange={(e) =>
                handleInputChange('address', e.target.value, 'delivery')
              }
              required
            />
          </div>
        )} */}
          </li>
          <li className={css.delivery_item}>
            <div className={css.delivery_option}>
              <input
                type="radio"
                id="courier"
                name="delivery"
                value="courier"
                // checked={delivery.type === 'courier'}
                // onChange={() => handleDeliveryTypeChange('courier')}
              />
              <label htmlFor="courier">Доставка курʼєром Нова Пошта</label>
            </div>
            <p>від 135 грн</p>
            {/* {delivery.type === 'courier' && (
          <div className={css.delivery-details}>
            <input
              type="text"
              placeholder="Адреса"
              value={delivery.address}
              onChange={(e) =>
                handleInputChange('address', e.target.value, 'delivery')
              }
              required
            />
          </div>
        )} */}
          </li>
          <li className={css.delivery_item}>
            <div className={css.delivery_option}>
              <input
                type="radio"
                id="ukrposhta"
                name="delivery"
                value="ukrposhta"
                // checked={delivery.type === 'ukrposhta'}
                // onChange={() => handleDeliveryTypeChange('ukrposhta')}
              />
              <label htmlFor="ukrposhta">Доставка Укрпошта у відділення</label>
            </div>
            <p>від 80 грн</p>
            {/* {delivery.type === 'ukrposhta' && (
          <div className={css.delivery-details}>
            <input
              type="text"
              placeholder="Адреса"
              value={delivery.address}
              onChange={(e) =>
                handleInputChange('address', e.target.value, 'delivery')
              }
              required
            />
          </div>
        )} */}
          </li>
        </ul>
      </div>
      <button
        type="button"
        className={css.btn_continue}
        disabled
        // disabled={!isButtonEnabled}
      >
        Продовжити
      </button>
    </section>
  );
}
