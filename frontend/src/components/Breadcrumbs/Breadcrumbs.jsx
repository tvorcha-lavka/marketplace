import { NavLink } from 'react-router-dom';

import BreadcrumbsSkeleton from './BreadcrumbsSkeleton';

import useDelayedLoading from '../../hooks/useDelayedLoading';

import css from './Breadcrumbs.module.css';

export default function Breadcrumbs({ links }) {
  const delayedLoading = useDelayedLoading();

  if (delayedLoading) {
    return <BreadcrumbsSkeleton />;
  }

  return (
    <div className={css.way}>
      {links.map(({ label, to, isActive, isButton, onClick }, index) => {
        const isLast = index === links.length - 1;
        const className = isActive ? css.active : css.navLink;

        if (isButton) {
          return (
            <button
              key={label + index}
              onClick={onClick}
              className={css.btnLink}
            >
              {label}
              {!isLast && <span>&nbsp;/&nbsp;</span>}
            </button>
          );
        }

        return (
          <NavLink key={to + label} to={to} className={className}>
            {label}
            {!isLast && <span>&nbsp;/&nbsp;</span>}
          </NavLink>
        );
      })}
    </div>
  );
}
