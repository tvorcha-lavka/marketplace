import { NavLink } from 'react-router-dom';
import AddAdvert from '../../components/AddAvertisement/AddAdvert/AddAdvert';
import css from './AddAdvertisementPage.module.css';

export default function AddAdvertisementPage() {
  const activeClass = ({ isActive }) =>
    isActive ? `${css.active}` : `${css.navLink}`;

  return (
    <div className={css.advertisement_container}>
      <div className={css.navbox}>
        <NavLink to="/" className={activeClass}>
          Головна /
        </NavLink>
        <NavLink to="/advertisement" className={activeClass}>
          Додати оголошення
        </NavLink>
      </div>
      <AddAdvert />
    </div>
  );
}
