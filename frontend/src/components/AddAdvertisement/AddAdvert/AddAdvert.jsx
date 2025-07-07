import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import BrowseImage from '../BrowseImage/BrowseImage';
import CategorySelectSection from '../CategorySelectSection/CategorySelectSection';
import FiltersSection from '../FiltersSection/FiltersSection';
import ColorOptionsSelector from '../ColorOptionsSelector/ColorOptionsSelector';
import PriceSection from '../PriceSection/PriceSection';
import DescriptionField from '../DescriptionField/DescriptionField';
import DeliveryOptions from '../DeliveryOptions/DeliveryOptions';
import CustomButton from '../../ButtonElements/CustomButton/CustomButton';
import AddAdvertSkeleton from './AddAdvertSkeleton';

import { createProduct } from '../../../redux/addAdverts/operations';
import {
  selectCreateSuccess,
  selectCreatedProduct,
  selectAdvertsDetails,
  selectIsLoading,
} from '../../../redux/addAdverts/selectors';
import { setField, resetAdvert } from '../../../redux/addAdverts/slice';
import { selectSelectedCategoryId } from '../../../redux/categories/categoriesSelectors';
import { setSelectedCategoryId } from '../../../redux/categories/categoriesSlice';
import { getFiltersCategory } from '../../../redux/filters/filtersOperations';
import { selectFiltersCategory } from '../../../redux/filters/filtersSelector';
import { saveFilters } from '../../../utils/filtersDB';
import useDelayedLoading from '../../../hooks/useDelayedLoading';

import css from './AddAdvert.module.css';

export default function AddAdvert() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const success = useSelector(selectCreateSuccess);
  const created = useSelector(selectCreatedProduct);

  const isLoading = useSelector(selectIsLoading);
  const delayedLoading = useDelayedLoading(isLoading);

  const {
    selectedCategory,
    selectedSubCategory,
    selectedChildCategory,
    selectedFilters,
    selectedColors,
    isSelectedDelivery,
    title,
    description,
    price,
  } = useSelector(selectAdvertsDetails);

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

  const getReadableFilters = () => {
    const result = [];

    Object.entries(selectedFilters).forEach(([filterName, filterValue]) => {
      if (!filterValue) return;

      const filter = filtersDescription.find((f) => f.name === filterName);
      if (!filter) return;

      result.push({
        title: filter.title,
        value: filterValue,
      });
    });

    return result;
  };

  const submitTypeRef = useRef('publish');

  const handleSubmit = (e) => {
    e.preventDefault();

    const isDraftSubmission = submitTypeRef.current === 'draft';

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
      title: title.trim(),
      description: description.trim(),
      price: price.trim(),
      filters: filterIds.join(','),
      delivery: isSelectedDelivery,
      draft: isDraftSubmission,
    };

    dispatch(createProduct(data)).then(() => {
      sessionStorage.removeItem('ad_selectedFiles');

      navigate('/confirmation/ad', {
        state: { isDraft: isDraftSubmission },
      });
    });
  };

  useEffect(() => {
    if (success && created) {
      const productId = created.product_id;

      const readableFilters = getReadableFilters();

      if (productId && session_id && readableFilters.length > 0) {
        saveFilters(productId, session_id, readableFilters).then(() => {});
      }

      dispatch(resetAdvert());
    }
  }, [success, created, session_id]);

  if (isLoading || delayedLoading) {
    return <AddAdvertSkeleton />;
  }

  return (
    <div>
      <h2 className={css.advertTitle}>Додати оголошення</h2>

      <form className={css.form} onSubmit={handleSubmit}>
        <CategorySelectSection
          selectedCategory={selectedCategory}
          setSelectedCategory={(value) =>
            dispatch(setField({ field: 'selectedCategory', value }))
          }
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={(value) =>
            dispatch(setField({ field: 'selectedSubCategory', value }))
          }
          selectedChildCategory={selectedChildCategory}
          setSelectedChildCategory={(value) =>
            dispatch(setField({ field: 'selectedChildCategory', value }))
          }
        />

        <DescriptionField
          title={title}
          setTitle={(value) => dispatch(setField({ field: 'title', value }))}
          description={description}
          setDescription={(value) =>
            dispatch(setField({ field: 'description', value }))
          }
        />

        <BrowseImage />

        <FiltersSection
          filtersDescription={filtersDescription}
          selectedFilters={selectedFilters}
          setSelectedFilters={(value) =>
            dispatch(setField({ field: 'selectedFilters', value }))
          }
        />

        <ColorOptionsSelector
          filtersDescription={filtersDescription}
          selectedColors={selectedColors}
          setSelectedColors={(value) =>
            dispatch(setField({ field: 'selectedColors', value }))
          }
        />

        <PriceSection
          price={price}
          setPrice={(value) => dispatch(setField({ field: 'price', value }))}
        />

        <DeliveryOptions
          isSelectedDelivery={isSelectedDelivery}
          setIsSelectedDelivery={(value) =>
            dispatch(setField({ field: 'isSelectedDelivery', value }))
          }
        />

        <div className={css.btnWrapper}>
          <CustomButton
            variant="another"
            size="custom5"
            type="submit"
            onClick={() => (submitTypeRef.current = 'draft')}
          >
            Зберегти чорнетку
          </CustomButton>
          <CustomButton
            variant="default"
            size="custom4"
            type="submit"
            onClick={() => (submitTypeRef.current = 'publish')}
          >
            Опублікувати оголошення
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
