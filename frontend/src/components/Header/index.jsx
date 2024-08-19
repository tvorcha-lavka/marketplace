import { Link } from 'react-router-dom';

import Logo from '../Logo';
import Searchbar from '../Searchbar';
import AddItemButton from '../AddItemButton';

import styles from './styles.module.css';

export default function Header() {
  return (
    <section className={styles.section}>
      <div>
        <Logo />
        <button className={styles.catalogBtn}>Каталог</button>
        <Searchbar />
        <Link to="/cart">Cart</Link>
      </div>
      <div>
        <Link to="/login">Увійти</Link>
        <AddItemButton />
      </div>
    </section>
  );
}
