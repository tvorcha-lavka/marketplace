import React from 'react';
import Logo from '../Logo/Logo';
import { NavLink } from 'react-router-dom';
import { PiHeadphones } from 'react-icons/pi';
import css from './HeaderCart.module.css';

export default function HeaderCart() {
  return (
    <div className={css.header}>
      <div className={css.container}>
        <Logo />
        <NavLink to="/support" className={css.nav_link}>
          <PiHeadphones size={24} />
          <p>Потрібна допомога</p>
        </NavLink>
      </div>
    </div>
  );
}
