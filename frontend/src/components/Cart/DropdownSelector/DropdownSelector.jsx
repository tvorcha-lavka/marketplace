import { useEffect, useState } from 'react';
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
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    if (value) {
      setSearchTerm(value);
    }
  }, [value]);

  useEffect(() => {
    if (Object.keys(cachedData).length === 0) {
      const fetchInitialData = async () => {
        dispatch(cacheAction({ searchTerm: '', data: fetchData }));
        setDataList(fetchData);
      };
      fetchInitialData();
    } else {
      setDataList(cachedData[''] || []);
    }
  }, [cachedData, dispatch, cacheAction, fetchData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (cachedData[searchTerm]) {
        setDataList(cachedData[searchTerm]);
      } else {
        const fetchFilteredData = async () => {
          const filteredData = fetchData.filter((item) =>
            item.toLowerCase().includes(searchTerm.toLowerCase())
          );
          dispatch(cacheAction({ searchTerm, data: filteredData }));
          setDataList(filteredData);
        };
        fetchFilteredData();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, cachedData, dispatch, cacheAction, fetchData]);

  const handleSelectItem = (item) => {
    const selectedItem = String(item);
    setSearchTerm(selectedItem);
    onChange(selectedItem);
    dispatch(updateAction({ [fieldKey]: selectedItem }));
    setOpen(false);
  };

  return (
    <div className={css.detailsWrapper}>
      <label htmlFor={fieldKey} className={css.detailsLabel}>
        {label}&#42;
      </label>
      <div className={css.detailsInputBox}>
        <input
          id={fieldKey}
          name={fieldKey}
          className={css.detailsInput}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onClick={() => setOpen(!open)}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
        <button type="button" onClick={() => setOpen(!open)}>
          {open ? (
            <GoChevronUp className={css.detailsIcon} size={24} />
          ) : (
            <GoChevronDown className={css.detailsIcon} size={24} />
          )}
        </button>
      </div>
      {open && (
        <div className={css.detailsSelect}>
          <div className={css.scrollBox}>
            <div className={css.scrollBoxInner}>
              <ul className={css.optionList}>
                {dataList.map((item) => (
                  <li
                    key={item}
                    className={css.optionItem}
                    onClick={() => handleSelectItem(item)}
                  >
                    {item}
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
