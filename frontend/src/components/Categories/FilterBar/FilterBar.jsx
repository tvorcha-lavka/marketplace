import { useEffect, useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { filterBar } from '../../../utils/filterBar';
import css from './FilterBar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getFiltersCategory } from '../../../redux/filters/filtersOperations';
import {
  selectActiveFilters,
  selectFiltersCategory,
} from '../../../redux/filters/filtersSelector';
import { toggleFilter } from '../../../redux/filters/filtersSlice';

export default function FilterBar({ categoryId }) {
  const filters = useSelector(selectFiltersCategory);
  const activeFilters = useSelector(selectActiveFilters);
  const dispatch = useDispatch();
  const [openFilters, setOpenFilters] = useState({});

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

  return (
    <form className={css.filters} onSubmit={(e) => e.preventDefault()}>
      {filters?.map((filter) => (
        <fieldset key={filter.id} className={css.filter_group}>
          <legend className={css.group_title}>
            <button
              className={css.btn_filter}
              onClick={() => toggleFilterOpen(filter.id)}
            >
              {filter.name}
              {openFilters[filter.id] ? (
                <RiArrowUpSLine className={css.icon_filter} size="24" />
              ) : (
                <RiArrowDownSLine className={css.icon_filter} size="24" />
              )}
            </button>
          </legend>
          {openFilters[filter.id] && (
            <div className={css.filter_option}>
              {filter.values.map((option) => (
                <label key={option.id} className={css.option_label}>
                  <input
                    className={css.input}
                    type="checkbox"
                    value={option.value}
                    checked={
                      activeFilters[filter.id]?.includes(option.value) ?? false
                    }
                    onChange={() => handleToggleFilter(filter.id, option.value)}
                  />
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
