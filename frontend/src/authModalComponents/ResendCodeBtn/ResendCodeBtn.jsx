import { useDispatch, useSelector } from 'react-redux';

import { selectUserEmail } from '../../redux/auth/selectors';
import {
  resendRegisterCode,
  forgotPassword,
} from '../../redux/auth/operations';
import CustomButton from '../../components/ButtonElements/CustomButton/CustomButton';

import css from './ResendCodeBtn.module.css';

export default function ResendCodeBtn({ type }) {
  const email = useSelector(selectUserEmail);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    let action;

    if (type === 'verification-register') {
      action = resendRegisterCode({ email });
    } else {
      action = forgotPassword({ email });
    }

    dispatch(action)
      .unwrap()
      .then(() => {})
      .catch((e) => {
        console.error('Resend code verification failed:', e.message);
      });
  };

  return (
    <CustomButton
      onClick={handleSubmit}
      className={css.btn}
      size="auto"
      variant="another"
    >
      Надіслати код
    </CustomButton>
  );
}
