import { useState } from 'react';
import { useSelector } from 'react-redux';
import { GoChevronRight } from 'react-icons/go';

import { selectAllCategories } from '../../../redux/categories/categoriesSelectors';

import css from './CategoryModal.module.css';

export default function CategoryModal({ onSelectCategory }) {
  const [focusId, setFocusId] = useState(null);
  const [focusSubcategoriesId, setFocusSubcategoriesId] = useState(null);

  const сategories = useSelector(selectAllCategories);
  const allCategories = [...сategories].reverse();

  const subcategories =
    allCategories.find(({ id }) => id === focusId)?.children || [];
  const subcategoriesChildren =
    subcategories.find(({ id }) => id === focusSubcategoriesId)?.children || [];

  const handleMouseEnter = (id) => {
    setFocusId(id);
    setFocusSubcategoriesId(null);
  };

  const handleMouseSubcategoryEnter = (id) => {
    setFocusSubcategoriesId(id);
  };

  const handleCategoryClick = (category, level = 'category') => {
    const markedCategory = {
      ...category,
      isChild: level === 'child',
      isSubCategory: level === 'sub',
      parent: null,
      grandParent: null,
    };

    if (level === 'sub') {
      markedCategory.parent = allCategories.find(({ id }) => id === focusId);
    }

    if (level === 'child') {
      markedCategory.parent = subcategories.find(
        ({ id }) => id === focusSubcategoriesId
      );
      markedCategory.grandParent = allCategories.find(
        ({ id }) => id === focusId
      );
    }

    if (!category.children?.length) {
      onSelectCategory(markedCategory);
    }
  };

  return (
    <div className={css.modalBox}>
      {/* Main categories */}
      <div className={css.categoryBox}>
        <ul className={css.listCategories}>
          {allCategories.map((category) => (
            <li
              key={category.id}
              className={css.categoryItem}
              onMouseEnter={() => handleMouseEnter(category.id)}
              onClick={() => handleCategoryClick(category)}
            >
              <p>{category.title}</p>
              {category.children?.length > 0 && <GoChevronRight />}
            </li>
          ))}
        </ul>
      </div>

      {/* Subcategories */}
      {focusId !== null && subcategories.length > 0 && (
        <div className={css.categoryBox}>
          <ul className={css.listCategories}>
            {subcategories.map((subcategory) => (
              <li
                key={subcategory.id}
                className={css.categoryItem}
                onMouseEnter={() => handleMouseSubcategoryEnter(subcategory.id)}
                onClick={() => handleCategoryClick(subcategory, 'sub')}
              >
                <p>{subcategory.title}</p>
                {subcategory.children?.length > 0 && <GoChevronRight />}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sub-subcategories */}
      {focusSubcategoriesId !== null && subcategoriesChildren.length > 0 && (
        <ul className={css.listCategories}>
          {subcategoriesChildren.map((child) => (
            <li
              key={child.id}
              className={css.categoryItem}
              onClick={() => handleCategoryClick(child, 'child')}
            >
              <p>{child.title}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
