import { Link } from 'react-router-dom';

import { footerLinks } from './footerLinks.js';
import Logo from '../Logo/Logo';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Logo />
        <div className={styles.wrapper}>
          {footerLinks.map(({ title, links }) => (
            <div key={title} className={styles.wrapperList}>
              <h2 className={styles.title}>{title}</h2>
              <ul className={styles.list}>
                {links.map(({ text, url }) => (
                  <li key={text} className={styles.item}>
                    <Link to={url}>{text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
