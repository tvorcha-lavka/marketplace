import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logIn } from '../../redux/auth/operations';
import { useModal } from '../../hooks/useModal';
import { selectLoading } from '../../redux/auth/selectors';
import Loader from '../Loader/Loader';
import FormImgComponent from '../../components/FormImgComponent/FormImgComponent';
import css from './ConfirmationModal.module.css';

export default function ConfirmationModal({ type }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const isLoading = useSelector(selectLoading);

  const getTitle = () => {
    return type === 'verification-register'
      ? 'Реєстрацію завершено'
      : 'Ваш пароль змінено';
  };

  const getDescription = () => {
    return type === 'verification-register'
      ? 'Тепер ви можете зайти на cвій акаунт використовуючи свої дані для входу'
      : 'Тепер ви можете зайти на cвій акаунт використовуючи новий пароль';
  };

  const handleSubmit = async () => {
    const email = localStorage.getItem('emailForResendRegisterCode');
    const password = localStorage.getItem('passwordForResendRegisterCode');
    const emailForReset = localStorage.getItem('emailForReset');
    const newPwd = localStorage.getItem('newPwd');

    let dispatchAction;

    if (type === 'verification-register') {
      dispatchAction = logIn({ email, password });
    } else {
      dispatchAction = logIn({ email: emailForReset, password: newPwd });
    }

    try {
      await dispatch(dispatchAction).unwrap();

      // Clean up local storage
      const keysToRemove =
        type === 'verification-register'
          ? ['emailForResendRegisterCode', 'passwordForResendRegisterCode']
          : ['emailForReset', 'newPwd'];

      keysToRemove.forEach((key) => localStorage.removeItem(key));

      closeModal();
      navigate('/private');
    } catch (e) {
      console.error('Error during the dispatch:', e.message);
      // Optionally, you can show a user-friendly error message here
    }
  };

  return (
    <div className={css.container}>
      <FormImgComponent />

      {isLoading ? (
        <Loader />
      ) : (
        <div className={css.pageContent}>
          <h2 className={css.title}>{getTitle()}</h2>
          <p className={css.additionalInfo}>{getDescription()}</p>
          <button
            type="button"
            onClick={handleSubmit}
            className={css.loginLink}
          >
            Увійти
          </button>
        </div>
      )}
    </div>
  );
}
