import { Link } from 'react-router-dom';

import Logo from '../Logo/Logo';
import { footerLinks } from './footerLinks.js';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.section}>
      <div className={styles.container}>
        <Logo isFooter={true} />
        <div className={styles.wrapper}>
          {footerLinks.map(({ title, links }) => (
            <div key={title} className={styles.wrapperList}>
              <h2 className={styles.title}>{title}</h2>
              <ul className={styles.list}>
                {links.map(({ text, url }) => (
                  <li key={text} className={styles.item}>
                    <Link to={url} className={styles.link}>
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
