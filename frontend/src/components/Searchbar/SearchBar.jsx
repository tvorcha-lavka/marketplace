import sprite from '../../../public/icons/sprite.svg';

import styles from './SearchBar.module.css';

export default function Searchbar() {
  return (
    <div className={styles.searchBar}>
      <input placeholder="Пошук товару" className={styles.input} />
      <svg
        width={24}
        height={24}
        stroke="black"
        fill="transparent"
        className={styles.icon}
      >
        <use href={`${sprite}#icon-search`} />
      </svg>
    </div>
  );
}
