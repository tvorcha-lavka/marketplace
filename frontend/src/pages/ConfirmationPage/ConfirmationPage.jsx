import CustomButton from '../../components/CustomButton/CustomButton';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

import { media } from '../../utils/mediaConfig';

import css from './ConfirmationPage.module.css';

export default function ConfirmationPage() {
  const transferShopping = () => {
    navigate('/categories');
  };

  return (
    <section className="container">
      <div className={css.content}>
        <Breadcrumbs
          links={[
            { label: 'Головна', to: '/', isActive: false },
            { label: 'Кошик', to: '/cart', isActive: false },
            { label: 'Оформлення замовлення', to: '/order', isActive: false },
            { label: 'Підтвердження', to: '/confirmation', isActive: true },
          ]}
				/>
				
        <div className={css.wrapper}>
          <div className={css.infobox}>
            <p className={css.numberOrder}>
              Дякуємо, що обрали нас! Номер вашого замовлення
            </p>
            <p className={css.text}>Дата замовлення: 12/10/2024</p>
            <p className={css.text}>
              Незабаром на вашу електронну пошту прийде повідомлення з
              інформацією про відправлення посилки.
            </p>
          </div>
          <CustomButton
            className={css.btnContinue}
            size="custom3"
            type="button"
            variant="another"
            onClick={transferShopping}
          >
            Продовжити покупки
          </CustomButton>
          <img className={css.img} src={`${media}/cart/cart.png`} alt="cart" />
        </div>
      </div>
    </section>
  );
}
