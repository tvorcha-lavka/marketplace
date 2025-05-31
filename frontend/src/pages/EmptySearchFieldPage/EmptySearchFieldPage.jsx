import { media } from '../../utils/mediaConfig';

import RecommendedCards from '../../components/RecommendedCards/RecommendedCards';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

import css from './EmptySearchFieldPage.module.css';

export default function EmptySearchFieldPage() {
  return (
    <section className="container">
      <div className="section">
        <Breadcrumbs
          links={[
            { label: 'Головна', to: '/', isActive: false },
            { label: 'Результати пошуку', to: '/categories', isActive: true },
          ]}
        />

        <img
          className={css.image}
          src={`${media}/page/empty_result.png`}
          alt="Not Found"
        />

        <p className={css.text}>Нічого не знайдено</p>
        <p className={css.paragraph}>
          Спробуйте змінити запит або перегляньте популярні товари
        </p>

        <RecommendedCards title="Популярні товари від продавців:" />
      </div>
    </section>
  );
}
