import { Link } from 'react-router-dom';
import sprite from '../../../public/icons/sprite.svg';

import Logo from '../Logo/Logo';
import Searchbar from '../Searchbar/SearchBar';
import AddItemButton from '../AddItemButton/AddItemButton';

import styles from './Header.module.css';

export default function Header() {
  return (
    <section className={styles.section}>
      <div className={styles.firstPart}>
        <div className={styles.leftPart}>
          <Logo />
          <button className={styles.catalogBtn}>
            <svg width={32} height={32} stroke="black">
              <use href={`${sprite}#icon-burger`} />
            </svg>
            Каталог
          </button>
          <Searchbar />
          <AddItemButton />
        </div>
        <div className={styles.rightPart}>
          <Link to="/cart">
            <svg width={24} height={24}>
              <use href={`${sprite}#icon-cart`} />
            </svg>
          </Link>
          <Link to="/login">
            <svg width={32} height={32} stroke="black">
              <use href={`${sprite}#icon-user`} />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
