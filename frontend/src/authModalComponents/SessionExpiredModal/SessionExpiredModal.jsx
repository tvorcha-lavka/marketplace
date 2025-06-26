import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { media } from '../../utils/mediaConfig';
import { useModal } from '../../hooks/useModal';
import { setSessionExpired } from '../../redux/auth/slice';

import ModalBtnCross from '../../components/ButtonElements/ModalBtnCross/ModalBtnCross';
import CustomButton from '../../components/ButtonElements/CustomButton/CustomButton';

import css from './SessionExpiredModal.module.css';

export default function SessionExpiredModal() {
  const { openModal, closeModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSessionExpired = useSelector((state) => state.auth.isSessionExpired);

  const handleClose = () => {
    dispatch(setSessionExpired(false));
    closeModal();
    navigate('/');
  };

  if (!isSessionExpired) return null;

  const handleReLogin = () => {
    dispatch(setSessionExpired(false));
    closeModal();
    openModal('login');
  };

  return (
    <div className={css.modalBackdrop}>
      <div className={css.modal}>
        <ModalBtnCross onClick={handleClose} />
        <img
          className={css.image}
          src={`${media}/page/auth/session_illustration.png`}
          alt="Not Found"
        />
        <h2 className={css.title}>Сесія перервана</h2>
        <p className={css.text}>
          Здається, ваша сесія завершилася. Будь ласка, увійдіть знову, щоб
          продовжити покупки.
        </p>
        <CustomButton size="auto" type="button" onClick={handleReLogin}>
          Увійти знову
        </CustomButton>
      </div>
    </div>
  );
}
