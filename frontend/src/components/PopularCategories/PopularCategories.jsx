import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCategories } from '../../redux/categories/categoriesSelectors';
import { positionTitle, cardOrientation } from '../../utils/positionTitle';
import css from './PopularCategories.module.css';

export default function PopularCategories() {
  const categories = useSelector(selectCategories);
  const allCategories = [...categories].reverse();
  const fivePopCategories = allCategories
    .filter(({ popularity_score }) => popularity_score >= 0)
    .slice(0, 5);
  console.log(fivePopCategories);
  let verticalCounter = 0;

  return (
    <section className={css.container}>
      <div className={css.title_box}>
        <h2 className={css.title}>Популярні категорії</h2>
        <Link to="/categories/" className={css.link}>
          Всі категорії
        </Link>
      </div>

      <ul className={css.list}>
        {fivePopCategories?.map(({ title, card, id }) => {
          let orientationStyles = {};
          if (card.orientation === 'vertical') {
            orientationStyles = cardOrientation(
              card.orientation,
              verticalCounter
            );
            verticalCounter += 1;
          }
          // console.log(title);
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
              <h3 className={css.item_title} style={styles}>
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
    </section>
  );
}
