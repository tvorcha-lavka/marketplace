import { Link } from 'react-router-dom';

import styles from './Logo.module.css';

export default function Logo() {
  return (
    <Link to="/">
      <img width="101px" height="44px" src="/images/logo.png" />
    </Link>
  );
}
