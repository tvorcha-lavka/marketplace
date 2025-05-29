import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectPopCategories } from '../../redux/categories/categoriesSelectors';
import { getAllCategoriesWithPopular } from '../../redux/categories/categoriesOperations';
import { positionTitle, cardOrientation } from '../../utils/positionTitle';

import css from './PopularCategories.module.css';

export default function PopularCategories() {
  const dispatch = useDispatch();
  const popCategories = useSelector(selectPopCategories);

  let verticalCounter = 0;

  useEffect(() => {
    if (popCategories.length === 0) {
      dispatch(getAllCategoriesWithPopular());
    }
  }, [dispatch, popCategories]);

  return (
    <section className="container">
      <div className={css.section}>
        <div className={css.titleBox}>
          <h2 className={css.title}>Популярні категорії</h2>

          <Link to="/categories/" className={css.link}>
            Всі категорії
          </Link>
        </div>

        <ul className={css.list}>
          {popCategories?.map(({ title, card, id }) => {
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
    </section>
  );
}
