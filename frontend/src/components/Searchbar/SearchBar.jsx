import sprite from '../../../public/icons/sprite.svg';

import css from './SearchBar.module.css';

export default function Searchbar() {
  return (
    <div className={css.searchBar}>
      <input placeholder="Пошук товару" className={css.input} />
      <svg
        width={24}
        height={24}
        stroke="black"
        fill="transparent"
        className={css.icon}
      >
        <use href={`${sprite}#icon-search`} />
      </svg>
    </div>
  );
}
