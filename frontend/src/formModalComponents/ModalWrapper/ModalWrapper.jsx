import { useModal } from '../../hooks/useModal';
import { useClickEsc } from '../../hooks/useClickEsc';

import ModalBtnCross from '../../components/ModalBtnCross/ModalBtnCross';

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
            <ModalBtnCross onClick={closeModal} />
          </div>
        </div>
      )}
    </>
  );
}
