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
import { selectCategoryById } from '../../../redux/categories/categoriesSelectors';

import css from './Category.module.css';
import { selectSearchCategories } from '../../../redux/products/selectors';

export default function Category() {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const isFromSearch = location.state?.from === 'search';

  const category = useSelector(selectCategoryById);
  const fullSearchCategoryPath = useSelector(selectSearchCategories);

  useEffect(() => {
    if (categoryId) {
      dispatch(getCategoryById(categoryId));
    }
  }, [categoryId, dispatch]);

  // BREADCRUMBS LINKS
  const breadcrumbsLinksDefault = [
    { label: 'Головна', to: '/', isActive: false },
    { label: 'Всі категорії', to: '/categories', isActive: false },
    {
      label: category?.title || 'Категорія',
      to: `/categories/${categoryId}`,
      isActive: true,
    },
  ];

  let breadcrumbsLinksFromSearch = [
    { label: 'Головна', to: '/', isActive: false },
    { label: 'Всі категорії', to: '/categories', isActive: false },
  ];

  if (fullSearchCategoryPath.length > 0) {
    const searchCat = fullSearchCategoryPath[0];
    const pathTitles = searchCat.full_path || [];
    let currentPath = '/categories';

    const dynamicCrumbs = pathTitles.map((title, index) => {
      currentPath += `/${searchCat.slug}`;
      return {
        label: title,
        to: currentPath,
        isActive: index === pathTitles.length - 1,
      };
    });

    breadcrumbsLinksFromSearch = [
      ...breadcrumbsLinksFromSearch,
      ...dynamicCrumbs,
    ];
  }

  return (
    <div className="container">
      <div className="section">
        <Breadcrumbs
          links={
            isFromSearch && fullSearchCategoryPath.length > 0
              ? breadcrumbsLinksFromSearch
              : breadcrumbsLinksDefault
          }
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
