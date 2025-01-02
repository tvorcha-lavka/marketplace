import { media } from '../../../utils/mediaConfig';

import css from './Delivery.module.css';

export default function Delivery() {
  return (
    <>
      <h3 className={css.deliveryTitle}>Способи доставки</h3>
      <ul className={css.deliveryList}>
        <li className={css.deliveryItem}>
          <img
            className={css.novaPostLogo}
            src={`${media}/logo/nova_post.svg`}           
            alt="NovaPost logotype"
          />
          <p className={css.deliveryPost}>Нова Пошта</p>
        </li>
        <li className={css.deliveryItem}>
          <img
            className={css.ukrPostLogo}
            src={`${media}/logo/ukr_post.svg`}
            alt="UkrPost logotype"
          />
          <p className={css.deliveryPost}>Укр Пошта</p>
        </li>
      </ul>
    </>
  );
}
