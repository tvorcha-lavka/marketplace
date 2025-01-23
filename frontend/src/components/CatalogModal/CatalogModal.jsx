import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoChevronRight } from 'react-icons/go';
import { media } from '../../utils/mediaConfig';
import {
  selectCatalog,
  selectIsLoading,
  selectError,
} from '../../redux/categories/categoriesSelectors';
import { getCatalog } from '../../redux/categories/categoriesOperations';
import css from './CatalogModal.module.css';

export default function CatalogModal({ noFocuseModal }) {
  const [focusId, setFocusId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = useSelector(selectCatalog);
  // const isLoading = useSelector(selectIsLoading);

  // console.log(categories);
  const focusedCategory = categories?.find(
    (category) => category.id === focusId
  );
  const subcategories = focusedCategory?.children || [];

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCatalog());
    }
  }, [dispatch, categories]);

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
    <div className={css.modalBox} onMouseLeave={handleMouseLeave}>
      <div
        className={
          focusId !== null && subcategories.length > 0
            ? `${css.boxCategoriesOpen}`
            : `${css.boxCategories}`
        }
      >
        <ul
          className={
            focusId !== null
              ? `${css.listCategoriesOpen}`
              : `${css.listCategories}`
          }
        >
          {categories?.map((category) => (
            <li
              key={category.id}
              className={css.categoryItem}
              onMouseEnter={() => handleMouseEnter(category.id)}
              onClick={() => handleCategoryClick(category.id)}
            >
              <p>{category.title}</p>

              {category.children && category.children.length > 0 && (
                <GoChevronRight className={css.iconRight} />
              )}
            </li>
          ))}
        </ul>
      </div>
      {focusId !== null && subcategories.length > 0 && (
        <div className={css.categoryMenu}>
          <div className={css.scrollbox}>
            <div className={css.scrollbox_inner}>
              <ul className={css.listCards}>
                {subcategories.map((item, index) => (
                  <li key={index} className={css.itemCard}>
                    <h2 className={css.listTitle}>{focusedCategory.title}</h2>
                    <img
                      src={
                        item.image
                          ? `${item.image.url}`
                          : `${media}/page/404/not-found.png`
                      }
                      alt={item.title}
                      className={css.itemImg}
                    />
                    <div className={css.boxText}>
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
