import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCategories } from '../../redux/categories/categoriesSelectors';
import { positionTitle, cardOrientation } from '../../utils/positionTitle.js';
import css from './AllCategories.module.css';

export default function AllCategories() {
  const сategories = useSelector(selectCategories);
  const allCategories = [...сategories].reverse();
  console.log(allCategories);
  let verticalCounter = 0;

  return (
    <div className={css.container}>
      <div className={css.way}>
        <NavLink className={css.navLink} to="/">
          Головна /
        </NavLink>
        <NavLink className={css.active} to="/categories">
          Всі категорії /
        </NavLink>
      </div>
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
      </div>
    </div>
  );
}
