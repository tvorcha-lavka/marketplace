import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import CategorySlider from '../CategorySlider/CategorySlider';
import FilterBar from '../FilterBar/FilterBar';
import ProductList from '../ProductList/ProductList';
import SelectedFilters from '../SelectedFilters/SelectedFilters';
import Sort from '../Sort/Sort';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';

import { getCategoryById } from '../../../redux/categories/categoriesOperations';
import { selectCategoryById } from '../../../redux/categories/categoriesSelectors';

import css from './Category.module.css';

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
    <div className="container">
      <div className="section">
        <Breadcrumbs
          links={[
            { label: 'Головна', to: '/', isActive: false },
            { label: 'Всі категорії', to: '/categories', isActive: false },
            {
              label: category?.title || 'Категорія',
              to: `/categories/${categoryId}`,
              isActive: true,
            },
          ]}
        />

        <h2 className={css.categoryTitle}> {category?.title}</h2>

        <CategorySlider category={category} />

        <div className={css.wrapper}>
          <div className={css.filter}>
            <FilterBar categoryId={categoryId} />
          </div>
          <section className={css.productViewSort}>
            <div className={css.stickyBlock}>
              <SelectedFilters />
              <Sort />
              <ProductList categoryId={categoryId} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
