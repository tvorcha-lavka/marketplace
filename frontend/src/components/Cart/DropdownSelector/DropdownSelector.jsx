import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';

import css from './DropdownSelector.module.css';

export default function DropdownSelector({
  label,
  placeholder,
  cachedDataSelector,
  cacheAction,
  updateAction,
  fetchData,
  value,
  onChange,
  fieldKey,
}) {
  const dispatch = useDispatch();
  const cachedData = useSelector(cachedDataSelector);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(Boolean(searchTerm.trim()));
  }, [searchTerm]);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    if (open) setSearchTerm('');
  }, [open]);

	useEffect(() => {
    if (!cachedData[searchTerm] && fetchData?.length) {
      const filtered = fetchData.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      dispatch(cacheAction({ searchTerm, data: filtered }));
    }
  }, [searchTerm, cachedData, dispatch, cacheAction, fetchData]);

  const dataList = useMemo(() => {
    if (cachedData[searchTerm]) {
      return cachedData[searchTerm];
    }

    const filtered = fetchData.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    dispatch(cacheAction({ searchTerm, data: filtered }));
    return filtered;
  }, [searchTerm, cachedData, dispatch, cacheAction, fetchData]);

  const handleSelectItem = (item) => {
    setSearchTerm(item);
    onChange(item);
    dispatch(updateAction({ [fieldKey]: item }));
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (val === '') {
      onChange('');
      dispatch(updateAction({ [fieldKey]: '' }));
      setIsSelected(false);
    } else {
      setIsSelected(true);
    }
  };

  return (
    <div className={css.detailsWrapper}>
      <label htmlFor={fieldKey} className={css.detailsLabel}>
        {label} &#42;
      </label>

      <div className={css.detailsInputBox}>
        <input
          id={fieldKey}
          name={fieldKey}
          className={`${css.detailsInput} ${isSelected ? css.inputSelected : ''}`}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onClick={() => setOpen((prev) => !prev)}
          onChange={handleInputChange}
          required
          autoComplete="off"
          onBlur={() => {
            if (searchTerm.trim() === '') {
              onChange('');
              dispatch(updateAction({ [fieldKey]: '' }));
              setIsSelected(false);
            }
          }}
        />
        <button
          type="button"
          aria-label={open ? 'Закрити список' : 'Відкрити список'}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? (
            <GoChevronUp
              className={`${css.detailsIcon} ${isSelected ? css.selectedIcon : ''}`}
            />
          ) : (
            <GoChevronDown
              className={`${css.detailsIcon} ${isSelected ? css.selectedIcon : ''}`}
            />
          )}
        </button>
      </div>

      {open && dataList.length > 0 && (
        <div className={css.detailsSelect}>
          <div className={css.scrollBox}>
            <div className={css.scrollBoxInner}>
              <ul className={css.optionList}>
                {dataList.map((item) => (
                  <li
                    key={item.id || item}
                    className={css.optionItem}
                    onClick={() => handleSelectItem(item)}
                  >
                    {typeof item === 'string' ? item : item.label}
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
