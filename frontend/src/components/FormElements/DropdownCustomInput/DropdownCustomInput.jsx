import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { useEffect } from 'react';

import { useDropdown } from '../../../hooks/useDropdown';

import css from './DropdownCustomInput.module.css';

export default function DropdownCustomInput({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Оберіть значення',
  disabled = false,
  mode = 'list', // 'list' або 'modal'
  renderModal = null,
  inputWidth,
  editable = false,
  withLabel = true,
}) {
  const {
    open,
    setOpen,
    searchTerm,
    setSearchTerm,
    touched,
    dataList,
    selectItem,
    onInputChange,
    onInputBlur,
    dropdownRef,
  } = useDropdown({
    value,
    onChange,
    options,
    disabled,
  });

  useEffect(() => {
    if (open) {
      setSearchTerm('');
    }
  }, [open, setSearchTerm]);

  const showError = touched && !searchTerm.trim();

  const status = showError ? 'error' : value ? 'filled' : 'default';

  return (
    <div ref={dropdownRef} style={{ width: inputWidth }}>
      {withLabel && (
        <label htmlFor={label} className={css.label}>
          {label} &#42;
        </label>
      )}

      <div
        className={css.dropdownPosition}
        style={{
          width: inputWidth,
        }}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={onInputChange}
          onBlur={onInputBlur}
          onClick={() => !disabled && setOpen(!open)}
          className={css.input}
          data-status={status}
          style={{ width: inputWidth }}
          disabled={disabled}
          autoComplete="off"
          readOnly={!editable}
        />
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          aria-label={open ? 'Закрити список' : 'Відкрити список'}
        >
          {open ? (
            <GoChevronUp className={css.icon} data-status={status} />
          ) : (
            <GoChevronDown className={css.icon} data-status={status} />
          )}
        </button>

        {open && mode === 'list' && (
          <div className={css.optionWrap} style={{ width: inputWidth }}>
            <div className={css.scrollContainer}>
              <ul className={css.dropdownList}>
                {dataList.map((item) => {
                  const key = item.id || item.value || item;
                  const label =
                    typeof item === 'string' ? item : item.label || item.name;
                  return (
                    <li
                      key={key}
                      className={css.dropdownItem}
                      onMouseDown={() => selectItem(item)}
                    >
                      {label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {open && mode === 'modal' && renderModal?.()}
      </div>
      {disabled && <p className={css.errorMessage}>Спочатку оберіть місто</p>}
    </div>
  );
}
