import { useState, useEffect } from 'react';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { LiaEditSolid } from 'react-icons/lia';

import CategoryModal from '../CategoryModal/CategoryModal';

import css from './CategorySelectSection.module.css';

export default function CategorySelectSection({
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedChildCategory,
  setSelectedChildCategory,
  shouldReset,
}) {
  const [open, setOpen] = useState(false);
  const [isCategoryConfirmed, setIsCategoryConfirmed] = useState(false);
  const [touched, setTouched] = useState(false);

  const fullCategoryPath = [
    selectedCategory?.title,
    selectedSubCategory?.title,
    selectedChildCategory?.title,
  ]
    .filter(Boolean)
    .join(', ');

  const showError = touched && !isCategoryConfirmed && !fullCategoryPath;

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    setTouched(true);
  };

  const handleCategorySelect = (category) => {
    if (category.isChild) {
      setSelectedCategory(category.grandParent);
      setSelectedSubCategory(category.parent);
      setSelectedChildCategory(category);
    } else if (category.isSubCategory) {
      setSelectedCategory(category.parent);
      setSelectedSubCategory(category);
      setSelectedChildCategory(null);
    } else {
      setSelectedCategory(category);
      setSelectedSubCategory(null);
      setSelectedChildCategory(null);
    }
    setOpen(false);
    setIsCategoryConfirmed(true);
  };

  // const handleEditCategory = () => {
  //   setSelectedCategory(null);
  //   setSelectedSubCategory(null);
  //   setSelectedChildCategory(null);
  //   setIsCategoryConfirmed(false);
  //   setOpen(true);
  //   setTouched(false);
  // };

  useEffect(() => {
    if (shouldReset) {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedChildCategory(null);
      setIsCategoryConfirmed(false);
      setTouched(false);
      setOpen(false);
    }
  }, [shouldReset]);

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>Оберіть категорію</h3>

      {!isCategoryConfirmed ? (
        <>
          <label className={css.labelAdvert} htmlFor="categories">
            <p className={css.spanLabel}>Категорія &#42;</p>
          </label>

          <div className={css.categoryBox}>
            <input
              id="categories"
              name="categories"
              type="text"
              placeholder="Оберіть категорію"
              value={fullCategoryPath}
              readOnly
              onClick={toggleOpen}
              className={`${css.inputAdvert} ${open ? css.openBorder : ''} ${showError ? css.errorBorder : ''}`}
            />
            <button
              type="button"
              onClick={toggleOpen}
              aria-label={
                open ? 'Закрити список категорій' : 'Відкрити список категорій'
              }
            >
              {open ? (
                <GoChevronUp
                  className={`${css.categoryIcon} ${open ? css.openIcon : ''} ${showError ? css.errorIcon : ''}`}
                />
              ) : (
                <GoChevronDown
                  className={`${css.categoryIcon} ${open ? css.openIcon : ''} ${showError ? css.errorIcon : ''}`}
                />
              )}
            </button>
            {open && <CategoryModal onSelectCategory={handleCategorySelect} />}
          </div>

          {showError && (
            <p className={css.error}>Вибір категорії є обов'язковим</p>
          )}
        </>
      ) : (
        <div className={css.resultBox}>
          <p className={css.resultLabel}>
            Категорія:{' '}
            <span className={css.resultText}>{fullCategoryPath}</span>
          </p>
          <button
            type="button"
            className={css.editBtn}
            // onClick={handleEditCategory}
          >
            Редагувати <LiaEditSolid className={css.editIcon} />
          </button>
        </div>
      )}
    </fieldset>
  );
}
