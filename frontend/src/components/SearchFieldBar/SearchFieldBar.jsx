import { IoSearchOutline } from 'react-icons/io5';

import css from './SearchFieldBar.module.css';

export default function SearchFieldBar() {
  return (
    <div className={css.searchBar}>
      <input
        placeholder="Пошук товару"
        autoComplete="off"
        className={css.input}
      />
      <IoSearchOutline className={css.icon} />
    </div>
  );
}
