import { useModal } from '../../hooks/useModal';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword';
import CodeVerificationModal from '../CodeVerificationModal/CodeVerificationModal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import ChangePwdModal from '../ChangePwdModal/ChangePwdModal';
import RegisterForm from '../RegisterForm/RegisterForm';
import LoginForm from '../LoginForm/LoginForm';


const ModalParentComponent = () => {
  const { activeModal, openModal, modalProps } = useModal();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('modal');
    if (modal) {
      openModal(modal);
    }
  }, [location, openModal, activeModal]);

  return (
    <>
      {activeModal === 'login' && (
        <ModalWrapper>
          <LoginForm />
        </ModalWrapper>
      )}
      {activeModal === 'register' && (
        <ModalWrapper>
          <RegisterForm />
        </ModalWrapper>
      )}
      {activeModal === 'forgot-password' && (
        <ModalWrapper>
          <ForgotPassword />
        </ModalWrapper>
      )}
      {activeModal === 'change-pwd' && (
        <ModalWrapper>
          <ChangePwdModal />
        </ModalWrapper>
      )}
      {activeModal === 'confirmation-modal' && modalProps && (
        <ModalWrapper>
          <ConfirmationModal type={modalProps.type} />
        </ModalWrapper>
      )}
      {(activeModal === 'verification-register' ||
        activeModal === 'verification-reset') && (
        <ModalWrapper>
          <CodeVerificationModal type={activeModal} />
        </ModalWrapper>
      )}
    </>
  );
};

export default ModalParentComponent;
