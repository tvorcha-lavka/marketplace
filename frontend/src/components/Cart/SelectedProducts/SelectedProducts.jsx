import { LiaEditSolid } from 'react-icons/lia';
import image1 from '../../../images/img1.jpg';
import css from './SelectedProducts.module.css';

export default function SelectedProducts() {
  return (
    <section className={css.ordershopping_section}>
      <div className={css.goods_edit}>
        <p className={css.quantity_goods}>Ваш кошик (4 предмети)</p>
        <div className={css.editbox}>
          <p className={css.edit}>Редагувати</p>
          <LiaEditSolid size={16} />
        </div>
      </div>
      <div className={css.scrollbox}>
        <div className={css.scrollbox_inner}>
          <ul className={css.cart_list}>
            <li className={css.cart_item}>
              <img className={css.item_img} src={image1} alt="Item 1" />
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
              <p className={css.item_price}>599&nbsp;грн</p>
            </li>
            <li className={css.cart_item}>
              <img className={css.item_img} src={image1} alt="Item 1" />
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
              <p className={css.item_price}>599&nbsp;грн</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
