import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopCategories } from '../../redux/categories/categoriesOperations';
import { selectPopCategories } from '../../redux/categories/categoriesSelectors';
import popImg3 from '../../images/popImg3.png';

import css from './PopularCategories.module.css';

export default function PopularCategories() {
  const dispatch = useDispatch();
  const popCategories = useSelector(selectPopCategories);

  const fivePopCategories = popCategories.slice(0, 5);

  useEffect(() => {
    dispatch(getPopCategories());
  }, [dispatch]);

  return (
    <section className={css.container}>
      <div className={css.title_box}>
        <h2 className={css.title}>Популярні категорії</h2>
        <Link to="/categories/" className={css.link}>
          Всі категорії
        </Link>
      </div>

      <ul className={css.list}>
        {fivePopCategories?.map(({ title, image, card, id }, index) => (
          <li
            key={index}
            className={css.item}
            // style={{
            //   backgroundColor: getRandomColor(),
            // }}
          >
            <h3 className={css.item_title}>{title}</h3>
            <img src={popImg3} alt="" className={css.img1} />
          </li>
        ))}
      </ul>
    </section>
  );
}
