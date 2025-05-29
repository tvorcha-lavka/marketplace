import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { CiDiscount1, CiHeart, CiDeliveryTruck } from 'react-icons/ci';
import { PiHeadphones } from 'react-icons/pi';

import css from './HeaderDown.module.css';

export default function HeaderDown() {
  const getActiveClass = ({ isActive }) => {
    return clsx(css.navLink, isActive && css.active);
  };

  return (
    <header>
      <nav className={css.navbox}>
        <div className="container">
          <ul className={css.navList}>
            <li className={css.navItem}>
              <NavLink to="/discount" className={getActiveClass}>
                <CiDiscount1 size={24} />
                <p>Знижки</p>
              </NavLink>
            </li>
            <li className={css.navItem}>
              <NavLink to="/love_day" className={getActiveClass}>
                <CiHeart size={24} />
                <p>День закоханих</p>
              </NavLink>
            </li>
            <li className={css.navItem}>
              <NavLink to="/support" className={getActiveClass}>
                <PiHeadphones size={24} />
                <p>Потрібна допомога</p>
              </NavLink>
            </li>
            <li className={css.navItem}>
              <NavLink to="/payment-delivery" className={getActiveClass}>
                <CiDeliveryTruck size={24} />
                <p>Оплата і доставка</p>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
