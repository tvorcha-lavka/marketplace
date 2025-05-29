import { NavLink } from 'react-router-dom';
import { PiHeadphones } from 'react-icons/pi';

import Logo from '../Logo/Logo';

import css from './HeaderCart.module.css';

export default function HeaderCart() {
  return (
    <header className={css.header}>
      <div className="container">
        <div className={css.section}>
          <Logo />
          <NavLink to="/support" className={css.navLink}>
            <PiHeadphones size={24} />
            <p>Потрібна допомога</p>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
