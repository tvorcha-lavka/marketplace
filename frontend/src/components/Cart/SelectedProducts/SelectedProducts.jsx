import { Link } from 'react-router-dom';
import { LiaEditSolid } from 'react-icons/lia';
import { useSelector } from 'react-redux';
import { media } from '../../../utils/mediaConfig';
import css from './SelectedProducts.module.css';

export default function SelectedProducts() {
  const orderItems = useSelector((state) => state.cart.selectedItems);

  return (
    <section className={css.ordershopping_section}>
      <div className={css.goods_edit}>
        <p className={css.quantity_goods}>Ваш кошик ({orderItems.length})</p>
        <Link to="/cart" className={css.editbox}>
          <p className={css.edit}>Редагувати</p>
          <LiaEditSolid size={16} />
        </Link>
      </div>
      <div className={css.scrollbox}>
        <div className={css.scrollbox_inner}>
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
        </div>
      </div>
    </section>
  );
}
