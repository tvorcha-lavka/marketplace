import PropTypes from 'prop-types';
import { useModal } from '../../hooks/useModal';
import { useClickOutsideAndEsc } from '../../hooks/useClickOutsideAndEsc';
import { RxCross2 } from 'react-icons/rx';
import css from './ModalWrapper.module.css';

const ModalWrapper = ({ children }) => {
	const { activeModal, closeModal } = useModal();
	const modalRef = useClickOutsideAndEsc(closeModal);

  return (
    <>
      {activeModal && (
        <div className={css.overlay}>
          <div className={css.modal} ref={modalRef}>
            {children}
            <button
              className={css.crossBtn}
              onClick={closeModal}
              aria-label="Close"
            >
              <RxCross2 className={css.crossIcon} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalWrapper;

ModalWrapper.propTypes = {
  children: PropTypes.node, 
};
