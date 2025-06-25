import { LiaEditSolid } from 'react-icons/lia';

import css from './CustomEditButton.module.css';

export default function CustomEditButton({ onClick, children,  }) {
  return (
    <button
      type="button"
      className={css.editBtn}
      onClick={onClick}
      aria-label="Змінити/редагувати"
    >
      {children} <LiaEditSolid className={css.editIcon} />
    </button>
  );
}
