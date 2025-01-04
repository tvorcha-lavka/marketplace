import { LuCheckCircle } from 'react-icons/lu';

import CustomButton from '../../CustomButton/CustomButton';

import css from './BasketModal.module.css';

export default function BasketModal({ product, onClose, onOpenDetails }) {
  return (
    <>
      <span>
        <LuCheckCircle className={css.checkIcon} />
      </span>
      <h3 className={css.orderTitle}>Товар додано до кошика!</h3>
      <h2 className={css.productTitle}>{product.title}</h2>
      <CustomButton
        variant="default"
        size="semiMedium"
        className={css.orderBtn}
        onClick={onOpenDetails}
      >
        Перейти до кошика
      </CustomButton>
      <CustomButton variant="another" onClick={onClose} size="semiMedium">
        Продовжити покупки
      </CustomButton>
    </>
  );
}
