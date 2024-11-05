import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GoChevronRight } from 'react-icons/go';

import { media } from '../../utils/mediaConfig';
import {
  selectCategories,
  selectIsLoading,
  selectError,
} from '../../redux/categories/categoriesSelectors';

import css from './CatalogModal.module.css';

export default function CatalogModal() {
  const [focusId, setFocusId] = useState(null);

  const categories = useSelector(selectCategories);
  // const isLoading = useSelector(selectIsLoading);

  // console.log(categories);

  const focusedCategory = categories?.find((_, index) => index === focusId);
  const subcategories = focusedCategory?.children || [];

  const handleMouseEnter = (id) => {
    setFocusId(id);
  };

  const handleMouseLeave = () => {
    setFocusId(null);
  };

  return (
    <div className={css.modal_box} onMouseLeave={handleMouseLeave}>
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
          {categories?.map((category, id) => (
            <li key={id} className={css.category_item}>
              <Link
                className={css.category}
                onMouseEnter={() => handleMouseEnter(id)}
              >
                {category.title}
                {category.children && category.children.length > 0 && (
                  <GoChevronRight className={css.icon_right} />
                )}
              </Link>
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
                    <h2 className={css.list_title}>{focusedCategory.title}</h2>
                    <img
                      src={
                        item.image
                          ? `${item.image.url}`
                          : `{media}/page/404/not-found.png`
                      }
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
