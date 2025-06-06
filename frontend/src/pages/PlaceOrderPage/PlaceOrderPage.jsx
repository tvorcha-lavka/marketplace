import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CustomerData from '../../components/Cart/CustomerData/CustomerData';
import MethodDelivery from '../../components/Cart/MethodDelivery/MethodDelivery';
import MethodPayment from '../../components/Cart/MethodPayment/MethodPayment';
import SelectedProducts from '../../components/Cart/SelectedProducts/SelectedProducts';
import SummaryCart from '../../components/Cart/SummaryCart/SummaryCart';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

import { selectCartStep } from '../../redux/basket/selectors';
import { setDeliveryFee } from '../../redux/basket/slice';

import css from './PlaceOrderPage.module.css';

export default function PlaceOrderPage() {
  const [isClickBtn, setIsClickBtn] = useState(false);
  const step = useSelector(selectCartStep);
  const dispatch = useDispatch();

  const onDeliveryChange = (fee) => {
    dispatch(setDeliveryFee(fee));
  };

  return (
    <section className="container">
      <div className="section">
        <Breadcrumbs
          links={[
            { label: 'Головна', to: '/', isActive: false },
            { label: 'Кошик', to: '/cart', isActive: false },
            { label: 'Оформлення замовлення', to: '/order', isActive: true },
          ]}
        />

        <div className={css.orderbox}>
          <div className={css.leftColumn}>
            <div className={css.databox}>
              {(step === 1 || step === 2 || step === 3) && <CustomerData />}
            </div>
            <div className={css.deliverybox}>
              <h2 className={css.title}>2. Спосіб доставки</h2>
              {(step === 2 || step === 3) && (
                <MethodDelivery onDeliveryChange={onDeliveryChange} />
              )}
            </div>
            <div className={css.paymentbox}>
              <h2 className={css.title}>3. Спосіб оплати</h2>
              {step === 3 && (
                <MethodPayment
                  isClickBtn={isClickBtn}
                  setIsClickBtn={setIsClickBtn}
                />
              )}
            </div>
          </div>
          <div className={css.rightColumn}>
            <div className={css.stickyBlock}>
              <SelectedProducts />
              <SummaryCart isClickBtn={isClickBtn} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
