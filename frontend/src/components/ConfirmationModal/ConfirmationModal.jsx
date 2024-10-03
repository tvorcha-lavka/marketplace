import { useModal } from '../../hooks/useModal';
import FormImgComponent from '../../components/FormImgComponent/FormImgComponent';
import css from './ConfirmationModal.module.css';

export default function ConfirmationModal({ type }) {
  const { openModal } = useModal();

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

  return (
    <div className={css.container}>
      <FormImgComponent />
      <div className={css.pageContent}>
        <h2 className={css.title}>{getTitle()}</h2>
        <p className={css.additionalInfo}>{getDescription()}</p>
        <button
          type="button"
          onClick={() => openModal('login')}
          className={css.loginLink}
        >
          Увійти
        </button>
      </div>
    </div>
  );
}


