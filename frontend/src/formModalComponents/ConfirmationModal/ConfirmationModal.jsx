import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Loader from '../Loader/Loader';
import FormImgComponent from '../FormImgComponent/FormImgComponent';

import { useModal } from '../../hooks/useModal';
import { selectLoading } from '../../redux/auth/selectors';
import {
  getTitleConfirmation,
  getDescriptionConfirmation,
} from '../../utils/formUtils';

import css from './ConfirmationModal.module.css';

export default function ConfirmationModal({ type }) {
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const isLoading = useSelector(selectLoading);

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
          <h2 className={css.title}>{getTitleConfirmation(type)}</h2>
          <p className={css.additionalInfo}>{getDescriptionConfirmation(type)}</p>
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
