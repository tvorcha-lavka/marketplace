import { Link } from 'react-router-dom';

import { media } from '../../utils/mediaConfig';

import css from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <section className="container">
      <div className={css.section}>
        <div className={css.container}>
          <img
            className={css.imgFirst}
            src={`${media}/page/404/butterfly-first.png`}
            alt="Butterfly"
          />
          <h1 className={css.error}>404</h1>
          <p className={css.errorText}>
            Ми вже працюємо над розробкою цієї сторінки.
          </p>
          <Link to="/" className={css.link}>
            Повернутись на головну
          </Link>
          <img
            className={css.imgSecond}
            src={`${media}/page/404/butterfly-second.png`}
            alt="Butterfly"
          />
          <img
            className={css.imgThird}
            src={`${media}/page/404/butterfly-third.png`}
            alt="Butterfly"
          />
        </div>
      </div>
    </section>
  );
}
