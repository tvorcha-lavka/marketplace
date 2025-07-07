import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  selectAllCategories,
  selectIsLoading,
} from '../../redux/categories/categoriesSelectors';
import { positionTitle, cardOrientation } from '../../utils/positionTitle.js';
import useDelayedLoading from '../../hooks/useDelayedLoading';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import AllCategoriesSkeleton from './AllCategoriesSkeleton';

import css from './AllCategories.module.css';

export default function AllCategories() {
  const сategories = useSelector(selectAllCategories);

  const isLoading = useSelector(selectIsLoading);
  const delayedLoading = useDelayedLoading(isLoading);

  const allCategories = [...сategories].reverse();

  let verticalCounter = 0;

  return (
    <section className="container">
      <div className="section">
        <Breadcrumbs
          links={[
            { label: 'Головна', to: '/', isActive: false },
            { label: 'Всі категорії', to: '/categories', isActive: true },
          ]}
        />

        {isLoading || delayedLoading ? (
          <AllCategoriesSkeleton />
        ) : (
          <div className={css.box}>
            <h2 className={css.title}> Всі категорії</h2>
            <ul className={css.list}>
              {allCategories?.map(({ title, card, id }) => {
                let orientationStyles = {};
                if (card.orientation === 'vertical') {
                  orientationStyles = cardOrientation(
                    card.orientation,
                    verticalCounter
                  );
                  verticalCounter += 1;
                }
                const styles = positionTitle(card.title_position);

                return (
                  <Link
                    to={`/categories/${id}`}
                    key={id}
                    className={css.item}
                    style={{
                      ...orientationStyles,
                      backgroundColor: `${card.bg_color}`,
                    }}
                  >
                    <h3 className={css.itemTitle} style={styles}>
                      {title}
                    </h3>
                    <img
                      src={card.image.url}
                      alt={card.image.alt}
                      className={css.img}
                      style={{
                        width: `${card.image.size}px`,
                        top: `${card.image.y_axis}px`,
                        left: `${card.image.x_axis}px`,
                      }}
                    />
                  </Link>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
