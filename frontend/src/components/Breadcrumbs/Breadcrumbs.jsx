import { NavLink } from 'react-router-dom';

import css from './Breadcrumbs.module.css'; 

export default function Breadcrumbs({ links }) {
  return (
    <div className={css.way}>
      {links.map(({ label, to, isActive }, index) => {
        const isLast = index === links.length - 1;
        const className = isActive ? css.active : css.navLink;

        return (
          <NavLink key={to + label} to={to} className={className}>
            {label}
            {!isLast && <span> / </span>}
          </NavLink>
        );
      })}
    </div>
  );
}
