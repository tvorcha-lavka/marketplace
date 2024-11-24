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
      {/* <ul className={css.category_list}>
        {
          children?.length > 0 &&
            children.map((item, id) => (
              <li key={id} className={css.category_item}>
                <img
                  src={item.image ? `${item.image}` : photoAlternate}
                  alt={item.title}
                  className={css.item_img}
                />
                <p className={css.child_title}>
                  {item.title}
                  <span className={css.child_title_color}>({item.lft})</span>
                </p>
              </li>
            ))
        }
      </ul> */}
      <CategorySlider category={category} />

      <div className={css.wrapper}>
        <div className={css.filter}>
          <FilterBar id={categoryId} />
        </div>
        <section className={css.product_view_sort}>
          <div className={css.sort_filter}>
            <Sort />
          </div>
          <div className={css.main_product}>
            <ProductList />
          </div>
        </section>
      </div>
    </div>
  );
}
