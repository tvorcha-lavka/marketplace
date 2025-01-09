import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineDelete, AiOutlineClose } from 'react-icons/ai';
import {
  removeActiveFilters,
  clearAllFilters,
} from '../../../redux/filters/filtersSlice';
import { selectSelectedFilters } from '../../../redux/filters/filtersSelector';
import css from './SelectedFilters.module.css';

export default function SelectedFilters() {
  const dispatch = useDispatch();
  const selectedFilters = useSelector(selectSelectedFilters);

  const hasSelectedFilters = selectedFilters.length > 0;

  const handleRemoveActiveFilter = (filterId, value) => {
    dispatch(removeActiveFilters({ id: filterId, value }));
  };

  const handleClearAllFilters = () => {
    dispatch(clearAllFilters());
  };
  return (
    <div className={css.selected_filters}>
      <ul className={css.selected_filters_list}>
        {selectedFilters.map((filter) => (
          <li className={css.filter_chip} key={`${filter.id}-${filter.value}`}>
            <span>{filter.value}</span>

            <AiOutlineClose
              size={16}
              onClick={() => handleRemoveActiveFilter(filter.id, filter.value)}
            />
          </li>
        ))}
      </ul>
      {hasSelectedFilters && (
        <button className={css.clear_all_btn} onClick={handleClearAllFilters}>
          <span>Видалити всі фільтри</span>
          <AiOutlineDelete size={16} />
        </button>
      )}
    </div>
  );
}
