import {Link} from 'react-router-dom'
import sprite from '../../../public/icons/sprite.svg';


import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link to="/" className={styles.itemLink}>
          <svg width={24} height={24}>
            <use href={`${sprite}#icon-sales`} />
          </svg>
          <h3>Знижки</h3>
          </Link>
        </li>
        <li className={styles.item}>
          <Link to="/" className={styles.itemLink}>
          <svg width={24} height={24}>
            <use href={`${sprite}#icon-heart`} />
          </svg>
          <h3>День закоханих</h3>
          </Link>
        </li>
        <li className={styles.item}>
          <Link to="/" className={styles.itemLink}>
          <svg width={24} height={24}>
            <use href={`${sprite}#icon-help`} />
          </svg>
          <h3>Потрібна допомога</h3>
          </Link>
        </li>
        <li className={styles.item}>
          <Link to="/" className={styles.itemLink}>
          <svg width={24} height={24}>
            <use href={`${sprite}#icon-delivery`} />
          </svg>
          <h3>Оплата і доставка</h3>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
