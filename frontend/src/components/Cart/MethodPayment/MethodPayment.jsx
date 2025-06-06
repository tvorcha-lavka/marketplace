import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../CustomButton/CustomButton';
import RadioPaymentInput from '../RadioPaymentInput/RadioPaymentInput';

import { nextStep, updatePaymentData } from '../../../redux/basket/slice';
import { selectPaymentData } from '../../../redux/basket/selectors';

import css from './MethodPayment.module.css';

export default function MethodPayment({ isClickBtn, setIsClickBtn }) {
  const paymentData = useSelector(selectPaymentData);
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
          <RadioPaymentInput
            id="liqpay"
            name="paymentData"
            value="liqpay"
            checked={paymentData.type === 'liqpay'}
            onChange={() => handlePaymentTypeChange('liqpay')}
            label="LiqPay (Кредитна карта, Google/Apple pay)"
            className={css.paymentOption}
          />
          <RadioPaymentInput
            id="imposed_payment"
            name="paymentData"
            value="imposed_payment"
            checked={paymentData.type === 'imposed_payment'}
            onChange={() => handlePaymentTypeChange('imposed_payment')}
            label="Накладений платіж"
            className={css.paymentOption}
          />
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
        <RadioPaymentInput
          id="liqpay"
          name="paymentData"
          value="liqpay"
          checked={paymentData.type === 'liqpay'}
          onChange={() => handlePaymentTypeChange('liqpay')}
          label="LiqPay (Кредитна карта, Google/Apple pay)"
          className={css.paymentOption + ' ' + css.inputResult}
        />
      )}
      {isClickBtn && paymentData.type === 'imposed_payment' && (
        <RadioPaymentInput
          id="imposed_payment"
          name="paymentData"
          value="imposed_payment"
          checked={paymentData.type === 'imposed_payment'}
          onChange={() => handlePaymentTypeChange('imposed_payment')}
          label="Накладений платіж"
          className={css.paymentOption + ' ' + css.inputResult}
        />
      )}
    </div>
  );
}
