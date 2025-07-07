import { useLocation, useNavigate } from 'react-router-dom';

import CustomButton from '../../components/ButtonElements/CustomButton/CustomButton';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ConfirmationPageSkeleton from './ConfirmationPageSkeleton';

import { media } from '../../utils/mediaConfig';
import useDelayedLoading from '../../hooks/useDelayedLoading';

import css from './ConfirmationPage.module.css';

export default function ConfirmationPage({ type }) {
  const delayedLoading = useDelayedLoading();
  const navigate = useNavigate();
  const location = useLocation();

  const isDraft = location.state?.isDraft;

  const transferShopping = () => {
    navigate('/categories');
  };

  const goToMyAds = () => navigate('/my-adds');

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

        {type === 'order' &&
          (delayedLoading ? (
            <ConfirmationPageSkeleton />
          ) : (
            <div className={css.wrapper}>
              <div className={css.infobox}>
                <p className={css.numberOrder}>
                  Дякуємо, що обрали нас! Номер вашого замовлення
                </p>
                <p className={css.text}>
                  Дата замовлення: {new Date().toLocaleDateString('uk-UA')}
                </p>
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
              <img
                className={css.imgOrder}
                src={`${media}/cart/cart.png`}
                alt="Cart"
              />
            </div>
          ))}

        {type === 'ad' &&
          (delayedLoading ? (
            <ConfirmationPageSkeleton />
          ) : (
            <div className={css.wrapper}>
              <div className={css.infobox}>
                <p className={css.addedOrder}>
                  {isDraft
                    ? 'Ваше оголошення було додано як чернетка'
                    : 'Ваше оголошення було додано'}
                </p>

                <p className={css.finalText}>
                  {isDraft
                    ? 'Після проходження модерації оголошення зʼявиться у Вашому списку чернеток'
                    : 'Після проходження модерації оголошення зʼявиться в нашому каталозі товарів'}
                </p>
              </div>
              <CustomButton
                className={css.btnContinue}
                size="custom"
                type="button"
                variant="another"
                onClick={goToMyAds}
              >
                Перейти до своїх оголошень
              </CustomButton>
              <img
                className={css.imgAdd}
                src={`${media}/cart/full-cart.png`}
                alt="Cart with presents"
              />
            </div>
          ))}
      </div>
    </section>
  );
}
