import { RxCross2 } from 'react-icons/rx';
import clsx from 'clsx';

import css from './ModalBtnCross.module.css';

export default function ModalBtnCross({ onClick, className, iconClassName }) {
  return (
    <>
      <button
        className={clsx(css.crossBtn, className)}
        type="button"
        onClick={onClick}
        aria-label="Close"
      >
        <RxCross2 className={clsx(css.crossIcon, iconClassName)} />
      </button>
    </>
  );
}
