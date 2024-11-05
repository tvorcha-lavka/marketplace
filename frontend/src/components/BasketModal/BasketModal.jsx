import { LuCheckCircle } from 'react-icons/lu';

import css from './BasketModal.module.css';

export default function BasketModal() {
  return (
    <div className={css.modalBox}>
      <span>
        <LuCheckCircle className={css.checkIcon} />
      </span>
      <h3 className={css.orderTitle}>Товар додано до кошика!</h3>
      <h2 className={css.productTitle}>
        Картина &#x201C;Залежний від сонця&#x201D; 50.8 &#x78; 60.9 см
      </h2>
      <button type="button" className={css.orderBtn}>
        Оформити замовлення
      </button>
      <button type="button" className={css.moreShoppingBtn}>
        Продовжити покупки
      </button>
    </div>
  );
}
