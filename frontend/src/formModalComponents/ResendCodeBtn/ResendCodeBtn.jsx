import { useDispatch, useSelector } from 'react-redux';
import { selectUserEmail } from '../../redux/auth/selectors';
import {
  resendRegisterCode,
  forgotPassword,
} from '../../redux/auth/operations';
import css from './ResendCodeBtn.module.css';

const ResendCodeBtn = ({ type }) => {
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
    <button type="button" onClick={handleSubmit} className={css.submitButton}>
      Надіслати код
    </button>
  );
};

export default ResendCodeBtn;
