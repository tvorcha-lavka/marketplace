import { LuCheckCircle } from 'react-icons/lu';

import css from './BasketModal.module.css';

export default function BasketModal({ product }) {
  return (
    <div className={css.modalBox}>
      <span>
        <LuCheckCircle className={css.checkIcon} />
      </span>
      <h3 className={css.orderTitle}>Товар додано до кошика!</h3>
      <h2 className={css.productTitle}>{product.title}</h2>
      <button type="button" className={css.orderBtn}>
        Оформити замовлення
      </button>
      <button type="button" className={css.moreShoppingBtn}>
        Продовжити покупки
      </button>
    </div>
  );
}
