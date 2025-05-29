import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';

import { getFiltersCategory } from '../../../redux/filters/filtersOperations';
import {
  selectActiveFilters,
  selectFiltersCategory,
} from '../../../redux/filters/filtersSelector';
import { toggleFilter } from '../../../redux/filters/filtersSlice';

import css from './FilterBar.module.css';

export default function FilterBar({ categoryId }) {
  const [openFilters, setOpenFilters] = useState({});
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });

  const filters = useSelector(selectFiltersCategory);
  const activeFilters = useSelector(selectActiveFilters);
  const dispatch = useDispatch();

  useEffect(() => {
    if (categoryId) {
      dispatch(getFiltersCategory(categoryId));
    }
  }, [dispatch, categoryId]);

  useEffect(() => {
    if (filters.length > 0) {
      setOpenFilters((prev) => {
        const newFilters = filters.reduce((acc, filter) => {
          acc[filter.id] = prev[filter.id] ?? true;
          return acc;
        }, {});
        return newFilters;
      });
    }
  }, [filters]);

  const toggleFilterOpen = (filterId) => {
    setOpenFilters((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }));
  };

  const handleToggleFilter = (filterId, value) => {
    dispatch(toggleFilter({ id: filterId, value }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
  };

  const renderColorValues = (values, id) => {
    return (
      <div className={css.colorbox}>
        {values.map((option) => (
          <button
            key={option.value}
            className={css.colorSquare}
            style={{ backgroundColor: option.metadata.hex_code }}
            value={option.value}
            onClick={() => handleToggleFilter(id, option.value)}
          ></button>
        ))}
      </div>
    );
  };

  const renderPriceRange = (min, max) => {
    return (
      <div className="price-range">
        <label>
          Від:
          <input
            type="number"
            name="min"
            value={priceRange.min}
            min={min}
            max={priceRange.max}
            onChange={handlePriceChange}
          />
        </label>
        <label>
          До:
          <input
            type="number"
            name="max"
            value={priceRange.max}
            min={priceRange.min}
            max={max}
            onChange={handlePriceChange}
          />
        </label>
      </div>
    );
  };

  return (
    <form className={css.filters} onSubmit={(e) => e.preventDefault()}>
      {filters?.map((filter) => (
        <fieldset key={filter.id} className={css.filterGroup}>
          <legend className={css.groupTitle}>
            <button
              className={css.btnFilter}
              onClick={() => toggleFilterOpen(filter.id)}
            >
              {filter.title}
              {openFilters[filter.id] ? (
                <RiArrowUpSLine className={css.iconFilter} size="24" />
              ) : (
                <RiArrowDownSLine className={css.iconFilter} size="24" />
              )}
            </button>
          </legend>
          {openFilters[filter.id] && (
            <div className={css.filterOption}>
              {filter.name === 'color' &&
                renderColorValues(filter.values, filter.id)}
              {filter.name !== 'color' &&
                filter.values.map((option) => (
                  <label key={option.id} className={css.optionLabel}>
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={
                        activeFilters[filter.id]?.includes(option.value) ??
                        false
                      }
                      onChange={() =>
                        handleToggleFilter(filter.id, option.value)
                      }
                    />
                    <span className={css.checkmark}></span>
                    {option.value}
                  </label>
                ))}
            </div>
          )}
        </fieldset>
      ))}
    </form>
  );
}
