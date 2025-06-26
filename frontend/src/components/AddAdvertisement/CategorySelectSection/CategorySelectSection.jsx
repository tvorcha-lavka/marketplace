import { useState, useEffect } from 'react';

import CategoryModal from '../CategoryModal/CategoryModal';
import DropdownCustomInput from '../../FormElements/DropdownCustomInput/DropdownCustomInput';
import CustomEditButton from '../../ButtonElements/CustomEditButton/CustomEditButton';

import css from './CategorySelectSection.module.css';

export default function CategorySelectSection({
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedChildCategory,
  setSelectedChildCategory,
}) {
  const [open, setOpen] = useState(false);
  const [isCategoryConfirmed, setIsCategoryConfirmed] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (
      (selectedCategory || selectedSubCategory || selectedChildCategory) &&
      !isCategoryConfirmed
    ) {
      setIsCategoryConfirmed(true);
    }
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedChildCategory,
    isCategoryConfirmed,
  ]);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const fullCategoryPath = [
    selectedCategory?.title,
    selectedSubCategory?.title,
    selectedChildCategory?.title,
  ]
    .filter(Boolean)
    .map(capitalize)
    .join(' / ');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (!selectedCategory && !selectedSubCategory && !selectedChildCategory) {
      setTouched(true);
    }
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
    setTouched(false);
  };

  const handleEditCategory = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedChildCategory(null);
    setIsCategoryConfirmed(false);
    setOpen(true);
    setTouched(false);
  };

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>Оберіть категорію</h3>

      {!isCategoryConfirmed ? (
        <>
          <DropdownCustomInput
            label="Категорія"
            value={fullCategoryPath}
            placeholder="Оберіть категорію"
            onSelect={handleCategorySelect}
            isOpen={open}
            onOpen={handleOpen}
            onClose={handleClose}
            error={!isCategoryConfirmed}
            touched={touched}
            mode="modal"
            renderModal={() => (
              <CategoryModal onSelectCategory={handleCategorySelect} />
            )}
            inputWidth="373px"
          />
        </>
      ) : (
        <div className={css.resultBox}>
          <p className={css.resultLabel}>
            Категорія:{' '}
            <span className={css.resultText}>{fullCategoryPath}</span>
          </p>

          <CustomEditButton onClick={handleEditCategory}>
            Редагувати
          </CustomEditButton>
        </div>
      )}
    </fieldset>
  );
}
