import { RxCross2 } from 'react-icons/rx';

import css from './ModalBtnCross.module.css';

export default function ModalBtnCross({ onClick }) {
  return (
    <>
      <button className={css.crossBtn} onClick={onClick} aria-label="Close">
        <RxCross2 className={css.crossIcon} />
      </button>
    </>
  );
}
