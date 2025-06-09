import { Link } from 'react-router-dom';

import Logo from '../Logo/Logo';

import { footerLinks } from '../../utils/footerLinks';

import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.section}>
      <div className="container">
        <div className={css.wrapper}>
          <Logo isFooter={true} />
          <div className={css.box}>
            {footerLinks.map(({ title, links }) => (
              <div key={title} className={css.wrapperList}>
                <h2 className={css.title}>{title}</h2>
                <ul className={css.list}>
                  {links.map(({ text, url }) => (
                    <li key={text} className={css.item}>
                      <Link to={url} className={css.link}>
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
