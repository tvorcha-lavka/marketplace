import { media } from '../../../utils/mediaConfig';

import css from './EmptyCartMessage.module.css';

export default function EmptyCartMessage() {
  return (
    <div className={css.emptyWrapper}>
      <h2 className={css.title}>Ваш кошик</h2>
      <img
        src={`${media}/cart/Empty_cart_illustration.png`}
        alt="Empty cart"
        className={css.image}
      />
      <h3 className={css.subtitle}>Ваш кошик порожній</h3>
      <p className={css.text}>Додайте товари, щоб оформити замовлення</p>
    </div>
  );
}
