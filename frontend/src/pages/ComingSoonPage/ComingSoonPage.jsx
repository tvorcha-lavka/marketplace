import { Link } from 'react-router-dom';

import { media } from '../../utils/mediaConfig';

import css from './ComingSoonPage.module.css';

export default function ComingSoonPage() {
  return (
    <section className="container">
      <div className={css.section}>
        <div className={css.container}>
          <img
            className={css.imgFirst}
            src={`${media}/page/404/butterfly-first.png`}
            alt="Butterfly"
          />
          <h1 className={css.soonTitle}>
            Скоро тут з&#8217;явиться щось цікаве!
          </h1>
          <p className={css.soonText}>
            Ми ще не закінчили, але вже працюємо над цим
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
