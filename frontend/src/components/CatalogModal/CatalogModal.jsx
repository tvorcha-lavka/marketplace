import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { GoChevronRight } from 'react-icons/go';
import fotoAlternate from '../../images/not-found.png';
import {
  selectCategories,
  selectIsLoading,
  selectError,
} from '../../redux/categories/categoriesSelectors';
import css from './CatalogModal.module.css';

export default function CatalogModal({noFocuseModal}) {
  const [focusId, setFocusId] = useState(null);
  const navigate = useNavigate();

  const categories = useSelector(selectCategories);
  // const isLoading = useSelector(selectIsLoading);
  
  // console.log(categories);

  const focusedCategory = categories?.find((category) => category.id === focusId);
  const subcategories = focusedCategory?.children || [];


  const handleMouseEnter = (id) => {
    setFocusId(id);
  };

  const handleMouseLeave = () => {
    setFocusId(null);
  };
  const handleCategoryClick = (categoryId) => {
    noFocuseModal();
    navigate(`/categories/${categoryId}`);
  };

  return (
    <div
      className={css.modal_box}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={
          focusId !== null && subcategories.length > 0
            ? `${css.box_categories_open}`
            : `${css.box_categories}`
        }
      >
        <ul
          className={
            focusId !== null
              ? `${css.list_categories_open}`
              : `${css.list_categories}`
          }
        >
          {categories?.map((category) => (
            <li key={category.id}
              className={css.category_item}
              onMouseEnter={() => handleMouseEnter(category.id)}
              onClick={() => handleCategoryClick(category.id)}
            >              
              <p>{category.title}</p>

              {category.children && category.children.length > 0 && (
                  <GoChevronRight className={css.icon_right} />
                )}
            </li>
          ))}
        </ul>
      </div>
      {focusId !== null && subcategories.length > 0 && (
        <div className={css.category_menu}>
          <div className={css.scrollbox}>
            <div className={css.scrollbox_inner}>
              <ul className={css.list_cards}>
                {subcategories.map((item, index) => (
                  <li key={index} className={css.item_card}>
                    <h2 className={css.list_title}>
                      {focusedCategory.title}
                    </h2>
                    <img
                      src={item.image ? `${item.image.url}` : fotoAlternate}
                      alt={item.title}
                      className={css.item_img}
                    />
                    <div className={css.box_text}>
                      <p className={css.ttitle}>{item.title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
