import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoChevronRight } from 'react-icons/go';
import { selectAllCategories } from '../../../redux/categories/categoriesSelectors';
import { baseApiUrl } from '../../../redux/axiosConfig';
import css from './CategoryModal.module.css';
import { getFiltersCategory } from '../../../redux/filters/filtersOperations';

export default function CategoryModal({ onSelectCategory }) {
  const [focusId, setFocusId] = useState(null);
  const [focusSubcategoriesId, setFocusSubcategoriesId] = useState(null);
  const dispatch = useDispatch();
  const сategories = useSelector(selectAllCategories);
  const allCategories = [...сategories].reverse();

  console.log(сategories);
  const subcategories =
    allCategories?.find((category) => category.id === focusId)?.children || [];

  const subcategoriesChildren =
    subcategories?.find((category) => category.id === focusSubcategoriesId)
      ?.children || [];

  const handleMouseEnter = (id) => {
    setFocusId(id);
    setFocusSubcategoriesId(null);
  };

  const handleMouseSubcategoryEnter = (id) => {
    setFocusSubcategoriesId(id);
  };

  const handleCategoryClick = async (category) => {
    if (!category.children || category.children.length === 0) {
      onSelectCategory(category.title);
    }
  };

  return (
    <div className={css.modalBox}>
      <div className={css.categoryBox}>
        <ul className={css.listCategories}>
          {allCategories?.map((category) => (
            <li
              key={category.id}
              className={css.categoryItem}
              onMouseEnter={() => handleMouseEnter(category.id)}
              onClick={() => handleCategoryClick(category)}
            >
              <p>{category.title}</p>

              {category.children && category.children.length > 0 && (
                <GoChevronRight />
              )}
            </li>
          ))}
        </ul>
      </div>
      {focusId !== null && subcategories.length > 0 && (
        <div className={css.categoryBox}>
          <ul className={css.listCategories}>
            {subcategories?.map((subcategory) => (
              <li
                className={css.categoryItem}
                key={subcategory.id}
                onMouseEnter={() => handleMouseSubcategoryEnter(subcategory.id)}
                onClick={() => handleCategoryClick(subcategory)}
              >
                <p>{subcategory.title}</p>
                {subcategory.children && subcategory.children.length > 0 && (
                  <GoChevronRight />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {focusSubcategoriesId !== null && subcategoriesChildren.length > 0 && (
        <ul className={css.listCategories}>
          {subcategoriesChildren?.map((subcategoryChild) => (
            <li
              className={css.categoryItem}
              key={subcategoryChild.id}
              onClick={() => handleCategoryClick(subcategoryChild)}
            >
              <p>{subcategoryChild.title}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
