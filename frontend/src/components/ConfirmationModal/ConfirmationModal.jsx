import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import { selectLoading } from '../../redux/auth/selectors';
import Loader from '../Loader/Loader';
import FormImgComponent from '../../components/FormImgComponent/FormImgComponent';
import css from './ConfirmationModal.module.css';

export default function ConfirmationModal({ type }) {
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
    const accessToken = localStorage.getItem('accessToken');

    if (type === 'verification-register') {
      if (accessToken) {
        try {
          closeModal();
          navigate('/');
        } catch (e) {
          console.error('Error during the dispatch:', e.message);
        }
      }
    } else if ('change-pwd') {
      closeModal();
      navigate('/');
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
