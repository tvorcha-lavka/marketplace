import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';

import ModalWrapper from '../ModalWrapper/ModalWrapper';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import CodeVerificationModal from '../CodeVerificationModal/CodeVerificationModal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import ChangePwdModal from '../ChangePwdModal/ChangePwdModal';
import RegisterForm from '../RegisterForm/RegisterForm';
import LoginForm from '../LoginForm/LoginForm';
import useNoScroll from '../../hooks/useNoScroll';
import SessionExpiredModal from '../SessionExpiredModal/SessionExpiredModal';

export default function ModalParentComponent() {
  const { activeModal, openModal, modalProps } = useModal();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('modal');
    if (modal) {
      openModal(modal);
    }
  }, [location, openModal]);

  useNoScroll(activeModal);

  const MODAL_COMPONENT_MAP = {
    'session-expired': <SessionExpiredModal />,
    'login': <LoginForm />,
    'register': <RegisterForm />,
    'forgot-password': <ForgotPassword />,
    'change-pwd': <ChangePwdModal />,
    'confirmation-modal': modalProps && (
      <ConfirmationModal type={modalProps.type} />
    ),
    'verification-register': (
      <CodeVerificationModal type="verification-register" />
    ),
    'verification-reset': <CodeVerificationModal type="verification-reset" />,
  };

  const renderModalContent = () => MODAL_COMPONENT_MAP[activeModal] || null;

  return (
    <>{activeModal && <ModalWrapper>{renderModalContent()}</ModalWrapper>}</>
  );
}
