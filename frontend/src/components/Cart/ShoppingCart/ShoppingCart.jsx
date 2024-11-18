import { media } from '../../../utils/mediaConfig';
import { AiOutlineDelete } from 'react-icons/ai';
import css from './ShoppingCart.module.css';

export default function ShoppingCart() {
  return (
    <>
      <li className={css.cart_item}>
        <input type="checkbox" className={css.checkbox} />
        <img
          className={css.item_img}
          src={`${media}/page/404/not-found.png`}
          alt="Item 1"
        />
        <div className={css.item_details}>
          <h3 className={css.item_title}>
            Українська традиційна вишиванка жінoча Львівська
          </h3>
          <p className={css.item_seller}>
            Продавець: <span className={css.seller_name}>Lesia_OK12</span>
          </p>
          <p className={css.item_filter}>
            Розмір: M, Матеріал: Льон, Стан: Новий
          </p>
        </div>
        <p className={css.item_price}>599 грн</p>
        <button className={css.remove_btn}>
          <AiOutlineDelete color="red" />
        </button>
      </li>
      <li className={css.cart_item}>
        <input type="checkbox" className={css.checkbox} />
        <img
          className={css.item_img}
          src={`${media}/page/404/not-found.png`}
          alt="Item 1"
        />
        <div className={css.item_details}>
          <h3 className={css.item_title}>
            Українська традиційна вишиванка жінoча Львівська
          </h3>
          <p className={css.item_seller}>
            Продавець: <span className={css.seller_name}>Lesia_OK12</span>
          </p>
          <p className={css.item_filter}>
            Розмір: M, Матеріал: Льон, Стан: Новий
          </p>
        </div>
        <p className={css.item_price}>599 грн</p>
        <button className={css.remove_btn}>
          <AiOutlineDelete color="red" />
        </button>
      </li>
      <li className={css.cart_item}>
        <input type="checkbox" className={css.checkbox} />
        <img
          className={css.item_img}
          src={`${media}/page/404/not-found.png`}
          alt="Item 1"
        />
        <div className={css.item_details}>
          <h3 className={css.item_title}>
            Українська традиційна вишиванка жінoча Львівська
          </h3>
          <p className={css.item_seller}>
            Продавець: <span className={css.seller_name}>Lesia_OK12</span>
          </p>
          <p className={css.item_filter}>
            Розмір: M, Матеріал: Льон, Стан: Новий
          </p>
        </div>
        <p className={css.item_price}>599 грн</p>
        <button className={css.remove_btn}>
          <AiOutlineDelete color="red" />
        </button>
      </li>
      <li className={css.cart_item}>
        <input type="checkbox" className={css.checkbox} />
        <img
          className={css.item_img}
          src={`${media}/page/404/not-found.png`}
          alt="Item 1"
        />
        <div className={css.item_details}>
          <h3 className={css.item_title}>
            Українська традиційна вишиванка жінoча Львівська
          </h3>
          <p className={css.item_seller}>
            Продавець: <span className={css.seller_name}>Lesia_OK12</span>
          </p>
          <p className={css.item_filter}>
            Розмір: M, Матеріал: Льон, Стан: Новий
          </p>
        </div>
        <p className={css.item_price}>599 грн</p>
        <button className={css.remove_btn}>
          <AiOutlineDelete color="red" />
        </button>
      </li>
    </>
  );
}
