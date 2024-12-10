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
  selectError,
  selectIsLoading,
} from '../../../redux/categories/categoriesSelectors';
import css from './Category.module.css';
import SelectedFilters from '../SelectedFilters/SelectedFilters';

export default function Category() {
  const { categoryId } = useParams();
  // console.log(categoryId);
  const category = useSelector(selectCategoryById);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const { title } = category;
  const dispatch = useDispatch();
  useEffect(() => {
    if (categoryId) {
      dispatch(getCategoryById(categoryId));
    }
  }, [categoryId, dispatch]);
  // console.log(category);

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
          {title}
        </NavLink>
      </div>

      <h2 className={css.category_title}> {title}</h2>

      <CategorySlider category={category} />

      <div className={css.wrapper}>
        <div className={css.filter}>
          <FilterBar categoryId={categoryId} />
        </div>
        <section className={css.product_view_sort}>
          <SelectedFilters />
          <Sort />
          <ProductList />
          {/* <div className={css.sort_filter}>
          </div>
          <div className={css.main_product}>
          </div> */}
        </section>
      </div>
    </div>
  );
}
