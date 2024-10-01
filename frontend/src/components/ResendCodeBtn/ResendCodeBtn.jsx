import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectUser } from '../../redux/auth/selectors';
import {
  resendRegisterCode,
  forgotPassword,
} from '../../redux/auth/operations';
import css from './ResendCodeBtn.module.css';

const ResendCodeBtn = ({ type }) => {
  const isLoading = useSelector(selectLoading);
  const email = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const newUserEmail = localStorage.getItem('ResendRegisterCode');

    let action;

    if (type === 'verification-register') {
      action = resendRegisterCode({ email: newUserEmail });
    } else if (type === 'verification-reset') {
      action = forgotPassword({ email: email });
    } else {
      console.error('Invalid operation type');
      return;
    }

    dispatch(action)
      .unwrap()
      .then(() => {})
      .catch((e) => {
        return thunkAPI.rejectWithValue(e.message);
      });
  };

  return (
    <button
      type="button"
      onClick={handleSubmit}
      className={css.submitButton}
    >
      Повторно надіслати код
    </button>
  );
};

export default ResendCodeBtn;

ResendCodeBtn.propTypes = {
  type: PropTypes.oneOf(['verification-register', 'verification-reset'])
    .isRequired,
};
