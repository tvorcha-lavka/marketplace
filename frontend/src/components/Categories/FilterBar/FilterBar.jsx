import { useEffect, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { filterbar } from '../../../utils/filterbar';
import css from './FilterBar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectFiltersCategory } from '../../../redux/categories/categoriesSelectors';
import { filtersCategory } from '../../../redux/categories/categoriesOperations';

export default function FilterBar({ id }) {
  const filters = useSelector(selectFiltersCategory);
  console.log(filters);
  const dispatch = useDispatch();
  const [isOpenId, setIsOpenId] = useState(null);

  useEffect(() => {
    dispatch(filtersCategory(id));
  }, [dispatch]);
  return (
    <form className={css.filters} onSubmit={(e) => e.preventDefault()}>
      {filterbar?.map(({ title, filters }, id) => (
        <fieldset key={title} className={css.filter_group}>
          <legend className={css.group_title}>
            {title}
            <button className={css.btn_filter} onClick={() => setIsOpenId(id)}>
              <RiArrowDownSLine size="24" />
            </button>
          </legend>

          <ul className={css.filter_field}>
            {filters.map(({ subtitle, color }, id) => (
              <li key={id} className={css.field_item}>
                <input
                  className={css.input}
                  type="checkbox"
                  name=""
                  value={subtitle}
                  id={subtitle}
                />
                <label htmlFor={subtitle} className={css.filter_label}>
                  {subtitle}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ))}
    </form>
  );
}
