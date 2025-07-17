import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import CategorySlider from '../CategorySlider/CategorySlider';
import FilterBar from '../FilterBar/FilterBar';
import ProductList from '../ProductList/ProductList';
import SelectedFilters from '../SelectedFilters/SelectedFilters';
import Sort from '../Sort/Sort';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';

import { getCategoryById } from '../../../redux/categories/categoriesOperations';
import {
  selectCategoryById,
  selectCatalogFlat,
} from '../../../redux/categories/categoriesSelectors';
import { findCategoriesFromFullPath } from '../../../utils/breadcrumbs';

import css from './Category.module.css';

export default function Category() {
  const { categoryId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const category = useSelector(selectCategoryById);
  const categoryFlat = useSelector(selectCatalogFlat);

  const isFromSearch = location.state?.from === 'search';
  const fullPath = location.state?.full_path || [];
  const matchedCategories = findCategoriesFromFullPath(fullPath, categoryFlat);

  const filterIds =
    new URLSearchParams(location.search)
      .get('filters')
      ?.split(',')
      .map((id) => parseInt(id, 10))
      .filter(Boolean) || [];

  useEffect(() => {
    if (categoryId) {
      dispatch(getCategoryById(categoryId));
    }
  }, [categoryId, dispatch]);

  // BREADCRUMBS LINKS
  const defaultBreadcrumbs = [
    { label: 'Головна', to: '/' },
    { label: 'Всі категорії', to: '/categories' },
    {
      label: category?.title || 'Категорія',
      to: `/categories/${categoryId}`,
      isActive: true,
    },
  ];

  const searchBreadcrumbs = [
    { label: 'Головна', to: '/' },
    { label: 'Всі категорії', to: '/categories' },
    ...matchedCategories.map((path, index) => ({
      label: path.title,
      to: `/categories/${path.id}`,
      isActive: index === matchedCategories.length - 1,
    })),
  ];

  return (
    <div className="container">
      <div className={`${css.wrap} section`}>
        <Breadcrumbs
          links={
            isFromSearch && fullPath.length
              ? searchBreadcrumbs
              : defaultBreadcrumbs
          }
        />

        <h2 className={css.categoryTitle}> {category?.title}</h2>

        <CategorySlider category={category} />

        <div className={css.wrapper}>
          <div className={css.filter}>
            <FilterBar categoryId={categoryId} initialSelected={filterIds} />
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
