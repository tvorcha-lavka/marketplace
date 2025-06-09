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
    if (paymentData.type) {
      dispatch(nextStep());
      setIsClickBtn(true);
    }
  };

  const handlePaymentTypeChange = (type) => {
    dispatch(updatePaymentData({ type }));
  };

  const paymentOptions = [
    {
      id: 'liqpay',
      value: 'liqpay',
      label: 'LiqPay (Кредитна карта, Google/Apple pay)',
    },
    {
      id: 'imposed_payment',
      value: 'imposed_payment',
      label: 'Накладений платіж',
    },
  ];

  return (
    <div className={css.paymentSection}>
      {paymentOptions.map(({ id, value, label }) => {
        const isChecked = paymentData.type === value;
        const className = `${css.paymentOption}${isClickBtn && isChecked ? ' ' + css.inputResult : ''}`;

        return !isClickBtn || isChecked ? (
          <RadioPaymentInput
            key={id}
            id={id}
            name="paymentData"
            value={value}
            checked={isChecked}
            onChange={() => handlePaymentTypeChange(value)}
            label={label}
            className={className}
          />
        ) : null;
      })}

      {!isClickBtn && (
        <CustomButton
          className={css.btnContinue}
          size="small"
          type="submit"
          onClick={handleSubmit}
          disabled={!paymentData.type}
        >
          Продовжити
        </CustomButton>
      )}
    </div>
  );
}
