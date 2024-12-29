import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import CategorySlider from '../CategorySlider/CategorySlider';
import FilterBar from '../FilterBar/FilterBar';
import ProductList from '../ProductList/ProductList';
import Sort from '../Sort/Sort';

import { getCategoryById } from '../../../redux/categories/categoriesOperations';
import {
  selectCategoryById,
  selectIsLoading,
} from '../../../redux/categories/categoriesSelectors';

import css from './Category.module.css';

export default function Category() {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const category = useSelector(selectCategoryById);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    if (categoryId && !isLoading) {
      dispatch(getCategoryById(categoryId));
    }
  }, [categoryId, dispatch, isLoading]);

  return (
    <div className={css.container}>
      <ul className={css.way}>
        <li>
          <NavLink className={css.navLink} to="/">
            Головна/&nbsp;
          </NavLink>
        </li>
        <li>
          <NavLink className={css.navLink} to="/categories">
            Всі категорії/&nbsp;
          </NavLink>
        </li>
        <li>
          <NavLink className={css.active} to={`/categories/${categoryId}`}>
            {category?.title}
          </NavLink>
        </li>
      </ul>

      <h2 className={css.category_title}>{category?.title}</h2>

      <CategorySlider category={category} />

      <div className={css.wrapper}>
        <div className={css.filter}>
          <FilterBar />
        </div>
        <section className={css.product_view_sort}>
          <div className={css.sort_filter}>
            <Sort />
          </div>
          <div className={css.main_product}>
            <ProductList categoryId={categoryId} />
          </div>
        </section>
      </div>
    </div>
  );
}
