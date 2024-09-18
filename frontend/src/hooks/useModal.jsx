import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';

// Створюємо контекст
const ModalContext = createContext();

// Хук для доступу до контексту
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Провайдер контексту
export const ModalProvider = ({ children }) => {
	const [activeModal, setActiveModal] = useState(null);
	const [modalProps, setModalProps] = useState({});

  const openModal = (modalName, props = {}) => {
    setActiveModal(modalName);
    setModalProps(props); // Set the props for the modal
  };
  const closeModal = () => {
    setActiveModal(null);
    setModalProps({}); // Reset modal props on close
  };

  const value = {
    activeModal,
    openModal,
		closeModal,
		modalProps,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
