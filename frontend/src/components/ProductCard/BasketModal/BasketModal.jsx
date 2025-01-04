import { LuCheckCircle } from 'react-icons/lu';
import { toast } from 'react-hot-toast';

import CustomButton from '../../CustomButton/CustomButton';

import css from './BasketModal.module.css';

export default function BasketModal({ product, onClose, onOpenDetails }) {
  const handleContinueShopping = () => {
    toast.custom(() => (
      <div
        style={{
          backgroundColor: 'var(--primary-yellow-lighter)',
          color: 'var(--default-black)',
          width: '279px',
          height: '64px',
          padding: '20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: 'var(--font-size-tiny)',
          fontWeight: 'var(--font-weight-bold)',
          borderLeft:
            'var(--border-width-biggest) var(--border-style) var(--primary-yellow)',
          boxShadow: 'var(--cart-shadow)',
        }}
      >
        <LuCheckCircle style={{ fontSize: '24px' }} />
        Товар додано до кошика
      </div>
    ));
    onClose();
  };

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
      <CustomButton
        variant="another"
        onClick={handleContinueShopping}
        size="semiMedium"
      >
        Продовжити покупки
      </CustomButton>
    </>
  );
}
