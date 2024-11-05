import {
  CiDiscount1,
  CiHeart,
  CiDeliveryTruck,
} from 'react-icons/ci';
import { PiHeadphones } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import css from './HeaderDown.module.css';

export default function HeaderDown() {
  return (
    <nav className={css.navbox}>
      <ul className={css.nav_list}>
        <li className={css.nav_item}>
          <Link to="/discount" className={css.nav_link}>           
          <CiDiscount1 size={24} color="#da5135"/>

            <p className={css.nav_text_color}>Знижки</p>
          </Link>
        </li>
        <li className={css.nav_item}>
          <Link to="/love_day" className={css.nav_link}>
            <CiHeart size={24} />            
            <p className={css.nav_text}>День закоханих</p>
          </Link>
        </li>
        <li className={css.nav_item}>
          <Link to="/support" className={css.nav_link}>
            <PiHeadphones size={24} />            
            <p className={css.nav_text}>Потрібна допомога</p>
          </Link>
        </li>
        <li className={css.nav_item}>
          <Link to="/payment-delivery" className={css.nav_link}>
            <CiDeliveryTruck size={24} />           
            <p className={css.nav_text}>Оплата і доставка</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

