import PropTypes from 'prop-types';
import { useModal } from '../../hooks/useModal';
import FormImgComponent from '../../components/FormImgComponent/FormImgComponent';
import css from './ConfirmationModal.module.css';

export default function ConfirmationModal({ type }) {
  const { openModal } = useModal();

  const getTitle = () => {
    if (type === 'verification-register') {
      return 'Реєстрацію завершено';
    }
    if (type === 'verification-reset') {
      return 'Ваш пароль змінено';
    }
    return '';
  };

  const getDescription = () => {
    if (type === 'verification-register') {
      return 'Тепер ви можете зайти на cвій акаунт використовуючи свої дані для входу';
    }
    if (type === 'verification-reset') {
      return 'Тепер ви можете зайти на cвій акаунт використовуючи новий пароль';
    }
    return '';
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

ConfirmationModal.propTypes = {
  type: PropTypes.oneOf(['verification-register', 'verification-reset'])
    .isRequired,
};
