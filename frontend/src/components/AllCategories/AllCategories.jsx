import { NavLink, Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCategories } from '../../redux/categories/categoriesSelectors';
import css from './AllCategories.module.css';

export default function AllCategories() {
  const allCategories = useSelector(selectCategories);
  console.log(allCategories);
  const activeClass = ({ isActive }) =>
    isActive ? `${css.active}` : `${css.navLink}`;

  return (
    <div className={css.container}>
      <div className={css.way}>
        <NavLink className={activeClass} to="/">
          Головна /
        </NavLink>
        <NavLink className={activeClass} to="/categories">
          Всі категорії /
        </NavLink>
      </div>
      <div className={css.box}>
        <h2 className={css.title}> Всі категорії</h2>
        <ul className={css.list}>
          {allCategories?.map(({ title, image, card, id }, index) =>
            index !== 4 && index !== 9 ? (
              <Link
                to="/categoryId"
                key={id}
                className={css.item}
                style={{
                  backgroundColor: `${card.bg_color}`,
                }}
              >
                <h3
                  className={css.item_title}
                  // style={{
                  //   position: `${card.title_position}`,
                  // }}
                >
                  {title}
                </h3>
                <img
                  src={card.image.url}
                  alt={image.alt}
                  className={css.img1}
                  // style={{ size: `${card.image.size}` }}
                />
              </Link>
            ) : (
              <Link
                key={id}
                className={css.item}
                style={{
                  backgroundColor: `${card.bg_color}`,
                }}
              >
                <h3
                  className={css.item_title}
                  style={{
                    position: `${card.title_position}`,
                  }}
                >
                  {title}
                </h3>
                <img
                  src={card.image.url}
                  alt={image.alt}
                  className={css.img2}
                />
              </Link>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
