import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import CategorySlider from '../CategorySlider/CategorySlider';
import FilterBar from '../FilterBar/FilterBar';
import ProductList from '../ProductList/ProductList';
import Sort from '../Sort/Sort';

import { getCategoryById } from '../../../redux/categories/categoriesOperations';
import { selectCategoryById } from '../../../redux/categories/categoriesSelectors';

import css from './Category.module.css';
import SelectedFilters from '../SelectedFilters/SelectedFilters';

export default function Category() {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
	const category = useSelector(selectCategoryById);

  useEffect(() => {
    if (categoryId) {
      dispatch(getCategoryById(categoryId));
    }
  }, [categoryId, dispatch]);

  return (
    <div className={css.container}>
      <div className={css.way}>
        <NavLink className={css.navLink} to="/">
          Головна /
        </NavLink>
        <NavLink className={css.navLink} to="/categories">
          Всі категорії /
        </NavLink>
        <NavLink className={css.active} to={`/categories/${categoryId}`}>
          {category?.title}
        </NavLink>
      </div>

      <h2 className={css.category_title}> {category?.title}</h2>

      <CategorySlider category={category} />

      <div className={css.wrapper}>
        <div className={css.filter}>
          <FilterBar categoryId={categoryId} />
        </div>
        <section className={css.product_view_sort}>
          <SelectedFilters />
          <Sort />
          <ProductList categoryId={categoryId} />
        </section>
      </div>
    </div>
  );
}
