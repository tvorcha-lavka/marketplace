import { RxCross2 } from 'react-icons/rx';

import { useModal } from '../../hooks/useModal';
import { useClickEsc } from '../../hooks/useClickEsc';

import css from './ModalWrapper.module.css';

export default function ModalWrapper({ children }) {
  const { activeModal, closeModal } = useModal();
  const modalRef = useClickEsc(closeModal);

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
}
