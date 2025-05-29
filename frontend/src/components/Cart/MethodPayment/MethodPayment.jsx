import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../CustomButton/CustomButton';

import { nextStep, updatePaymentData } from '../../../redux/cart/cartSlice';

import css from './MethodPayment.module.css';

export default function MethodPayment({ isClickBtn, setIsClickBtn }) {
  const paymentData = useSelector((state) => state.cart.paymentData);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (paymentData.type) dispatch(nextStep());
    setIsClickBtn(!isClickBtn);
  };

  const handlePaymentTypeChange = (type) => {
    dispatch(updatePaymentData({ type }));
  };

  return (
    <div className={css.paymentSection}>
      {!isClickBtn && (
        <>
          <div className={css.paymentOption}>
            <input
              type="radio"
              id="liqpay"
              name="paymentData"
              value="liqpay"
              checked={paymentData.type === 'liqpay'}
              onChange={() => handlePaymentTypeChange('liqpay')}
            />
            <label htmlFor="liqpay">
              LiqPay (Кредитна карта, Google/Apple pay)
            </label>
          </div>
          <div className={css.paymentOption}>
            <input
              type="radio"
              id="imposed_payment"
              name="paymentData"
              value="imposed_payment"
              checked={paymentData.type === 'imposed_payment'}
              onChange={() => handlePaymentTypeChange('imposed_payment')}
            />
            <label htmlFor="imposed_payment">Накладений платіж</label>
          </div>
          <CustomButton
            className={css.btnContinue}
            size="small"
            type="submit"
            onClick={handleSubmit}
            disabled={!paymentData.type}
          >
            Продовжити
          </CustomButton>
        </>
      )}

      {isClickBtn && paymentData.type === 'liqpay' && (
        <div className={css.paymentOption}>
          <input
            className={css.inputResult}
            type="radio"
            id="liqpay"
            name="paymentData"
            value="liqpay"
            checked={paymentData.type === 'liqpay'}
            onChange={() => handlePaymentTypeChange('liqpay')}
          />
          <label htmlFor="liqpay">
            LiqPay (Кредитна карта, Google/Apple pay)
          </label>
        </div>
      )}
      {isClickBtn && paymentData.type === 'imposed_payment' && (
        <div className={css.paymentOption}>
          <input
            className={css.inputResult}
            type="radio"
            id="imposed_payment"
            name="paymentData"
            value="imposed_payment"
            checked={paymentData.type === 'imposed_payment'}
            onChange={() => handlePaymentTypeChange('imposed_payment')}
          />
          <label htmlFor="imposed_payment">Накладений платіж</label>
        </div>
      )}
    </div>
  );
}
