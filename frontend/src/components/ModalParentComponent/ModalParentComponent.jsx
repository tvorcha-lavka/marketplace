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
import './ModalParentComponent.css';

const ModalParentComponent = () => {
  const { activeModal, openModal, modalProps } = useModal();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('modal');
    if (modal) {
      openModal(modal);
    }
  }, [location, openModal]);

  useEffect(() => {
    if (activeModal) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => document.body.classList.remove('no-scroll');
  }, [activeModal]);

  const renderModalContent = () => {
    switch (activeModal) {
      case 'login':
        return <LoginForm />;
      case 'register':
        return <RegisterForm />;
      case 'forgot-password':
        return <ForgotPassword />;
      case 'change-pwd':
        return <ChangePwdModal />;
      case 'confirmation-modal':
        return modalProps && <ConfirmationModal type={modalProps.type} />;
      case 'verification-register':
      case 'verification-reset':
        return <CodeVerificationModal type={activeModal} />;
      default:
        return null;
    }
  };

  return (
    <>{activeModal && <ModalWrapper>{renderModalContent()}</ModalWrapper>}</>
  );
};

export default ModalParentComponent;
