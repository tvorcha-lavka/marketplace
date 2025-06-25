import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../ButtonElements/CustomButton/CustomButton';
import RadioInput from '../../FormElements/RadioInput/RadioInput';

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

        return !isClickBtn || isChecked ? (
          <RadioInput
            key={id}
            id={id}
            name="paymentData"
            value={value}
            checked={isChecked}
            onChange={() => handlePaymentTypeChange(value)}
            label={label}
            variant="extended"
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
