import { useEffect, useState, useMemo } from 'react';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';

import css from './DropdownSelector.module.css';

export default function DropdownSelector({
  label,
  placeholder,
  fetchData,
  value,
  onChange,
  fieldKey,
  disabledMessage,
  isDisabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [hasTriedToOpenWhenDisabled, setHasTriedToOpenWhenDisabled] =
    useState(false);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  const dataList = useMemo(() => {
    return fetchData.filter((item) => {
      const label =
        typeof item === 'string' ? item : item.label || item.name || '';
      return label.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, fetchData]);

  const handleSelectItem = (item) => {
    const label = typeof item === 'string' ? item : item.label || item.name;

    setSearchTerm(label);
    onChange(item);
    setOpen(false);
    setIsTouched(false);
    setHasTriedToOpenWhenDisabled(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (!open) setOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setOpen(false);
      if (open && !searchTerm.trim()) {
        setIsTouched(true);
      }
    }, 100);
  };

  const isSelected = Boolean(searchTerm.trim());
  const hasError = isTouched && !isSelected;

  return (
    <div className={css.detailsWrapper}>
      <label htmlFor={fieldKey} className={css.detailsLabel}>
        {label}&nbsp;&#42;
      </label>

      <div className={css.detailsInputBox}>
        <input
          id={fieldKey}
          name={fieldKey}
          className={`${css.detailsInput} ${isSelected ? css.inputSelected : ''} ${hasError ? css.inputError : ''}`}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => {
            setOpen(true);
            setHasTriedToOpenWhenDisabled(false);
          }}
          required
          autoComplete="off"
        />
        <button
          type="button"
          aria-label={open ? 'Закрити список' : 'Відкрити список'}
          onClick={() => {
            if (isDisabled) {
              setHasTriedToOpenWhenDisabled(true);
              return;
            }
            setOpen((prev) => {
              const nextState = !prev;
              if (!nextState && !searchTerm.trim()) {
                setIsTouched(true);
              }
              return nextState;
            });
          }}
        >
          {open ? (
            <GoChevronUp
              className={`${css.detailsIcon} ${isSelected ? css.selectedIcon : ''} ${hasError ? css.iconError : ''}`}
            />
          ) : (
            <GoChevronDown
              className={`${css.detailsIcon} ${isSelected ? css.selectedIcon : ''} ${hasError ? css.iconError : ''}`}
            />
          )}
        </button>
      </div>
      {hasError && <p className={css.errorMessage}>Обов&#8217;язкове поле</p>}
      {isDisabled && hasTriedToOpenWhenDisabled && (
        <p className={css.errorMessage}>{disabledMessage}</p>
      )}

      {open && !isDisabled && dataList.length > 0 && (
        <div className={css.detailsSelect}>
          <div className="scrollBox">
            <div className="scrollBoxInner">
              <ul className={css.optionList}>
                {dataList.map((item) => (
                  <li
                    key={item.id || item}
                    className={css.optionItem}
                    onMouseDown={() => handleSelectItem(item)}
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
