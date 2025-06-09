import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BrowseImage from '../BrowseImage/BrowseImage';
import CategorySelectSection from '../CategorySelectSection/CategorySelectSection';
import FiltersSection from '../FiltersSection/FiltersSection';
import ColorOptionsSelector from '../ColorOptionsSelector/ColorOptionsSelector';
import PriceSection from '../PriceSection/PriceSection';
import DescriptionField from '../DescriptionField/DescriptionField';
import DeliveryOptions from '../DeliveryOptions/DeliveryOptions';
import CustomButton from '../../CustomButton/CustomButton';

import { createProduct } from '../../../redux/products/operations';
import {
  selectCreateSuccess,
  selectCreatedProduct,
} from '../../../redux/products/selectors';
import { selectSelectedCategoryId } from '../../../redux/categories/categoriesSelectors';
import { setSelectedCategoryId } from '../../../redux/categories/categoriesSlice';
import { getFiltersCategory } from '../../../redux/filters/filtersOperations';
import { selectFiltersCategory } from '../../../redux/filters/filtersSelector';

import css from './AddAdvert.module.css';

export default function AddAdvert() {
  const [isSelectedDelivery, setIsSelectedDelivery] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedColors, setSelectedColors] = useState([]);
  const [filters, setFilters] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  const dispatch = useDispatch();

  const success = useSelector(selectCreateSuccess);
  const created = useSelector(selectCreatedProduct);

  const filtersDescription = useSelector(selectFiltersCategory);

  const session_id = localStorage.getItem('userId');

  useEffect(() => {
    const id =
      selectedChildCategory?.id ||
      selectedSubCategory?.id ||
      selectedCategory?.id;
    if (id) {
      dispatch(setSelectedCategoryId(id));
    }
  }, [selectedCategory, selectedSubCategory, selectedChildCategory, dispatch]);

  const categoryId = useSelector(selectSelectedCategoryId);

  useEffect(() => {
    if (categoryId) {
      dispatch(getFiltersCategory(categoryId));
    }
  }, [categoryId, dispatch]);

  useEffect(() => {
    if (success && created) {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedChildCategory(null);
      setSelectedFilters({});
      setSelectedColors([]);
      setIsSelectedDelivery([]);
      setFilters('');

      setShouldReset(true);
    }
  }, [success, created]);

  useEffect(() => {
    if (shouldReset) {
      setShouldReset(false);
    }
  }, [shouldReset]);

  const getFilterIds = () => {
    const ids = [];

    Object.entries(selectedFilters).forEach(([filterName, filterValue]) => {
      if (!filterValue) return;

      const filter = filtersDescription.find((f) => f.name === filterName);
      if (!filter) return;

      const valueObj = filter.values.find((v) => v.value === filterValue);
      if (valueObj) {
        ids.push(valueObj.id);
      }
    });

    const colorFilter = filtersDescription.find((f) => f.name === 'color');
    if (colorFilter) {
      ids.push(...selectedColors);
    }

    return ids;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const title = formData.get('title')?.trim();
    const description = formData.get('description')?.trim();
    const price = formData.get('price')?.trim();
    const filterIds = getFilterIds();

    const requiredFields = [
      { value: title, name: 'Title' },
      { value: categoryId, name: 'Category' },
      { value: description, name: 'Description' },
      { value: price, name: 'Price' },
    ];

    for (const field of requiredFields) {
      if (!field.value) {
        return;
      }
    }

    if (filterIds.length === 0) {
      return;
    }

    const data = {
      category_id: categoryId,
      session_id,
      title,
      description,
      price,
      filters: filterIds.join(','),
      delivery: isSelectedDelivery,
      draft: false,
    };

    console.log('Отправляем данные:', data);

    dispatch(createProduct(data));
  };

  return (
    <div>
      <h2 className={css.advertTitle}>Додати оголошення</h2>

      <form className={css.form} onSubmit={handleSubmit}>
        <CategorySelectSection
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
          selectedChildCategory={selectedChildCategory}
          setSelectedChildCategory={setSelectedChildCategory}
          shouldReset={shouldReset}
        />

        <DescriptionField shouldReset={shouldReset} />

        <BrowseImage shouldReset={shouldReset} />

        <FiltersSection
          filtersDescription={filtersDescription}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          shouldReset={shouldReset}
        />

        <ColorOptionsSelector
          filtersDescription={filtersDescription}
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
        />

        <PriceSection shouldReset={shouldReset} />

        <DeliveryOptions
          isSelectedDelivery={isSelectedDelivery}
          setIsSelectedDelivery={setIsSelectedDelivery}
        />

        <CustomButton className={css.btn} size="custom4" type="submit">
          Опублікувати оголошення
        </CustomButton>
      </form>
    </div>
  );
}
