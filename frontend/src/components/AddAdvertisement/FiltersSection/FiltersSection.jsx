import { useState } from 'react';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';

import {
  StyledInputLabel,
  StyledSelect,
  Options,
  menuStyles,
} from './FiltersSection.styled';

import css from './FiltersSection.module.css';

export default function FiltersSection({
  filtersDescription,
  selectedFilters,
  setSelectedFilters,
}) {
  const [openSelect, setOpenSelect] = useState(null);
  const [touchedFilters, setTouchedFilters] = useState({});

  const handleChange = (name, value) => {
    setSelectedFilters((prev) => ({ ...prev, [name]: value }));
    setTouchedFilters((prev) => ({ ...prev, [name]: true }));
  };

  const handleClose = () => {
    setOpenSelect(null);
  };

  const getIconColor = (showError, hasValue, isOpen) => {
		if (showError) return 'var(--error-red)';
		if (isOpen) return 'var(--grey-dark)';		
    return hasValue ? 'var(--default-black)' : 'var(--grey-dark)';
  };

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>Додайте характеристики</h3>
      <div className={css.detailbox}>
        {filtersDescription?.map((filter) => {
          if (filter.name === 'color') return null;

          const value = selectedFilters[filter.name];
          const hasValue = Boolean(value);
          const isOpen = openSelect === filter.name; 
          const showError = touchedFilters[filter.name] && !hasValue && !isOpen;

          return (
            <div
              key={filter.name}
              className={css.dropdown}
              onClick={() => {
                setOpenSelect(isOpen ? null : filter.name);
                setTouchedFilters((prev) => ({ ...prev, [filter.name]: true }));
              }}
            >
              <StyledInputLabel htmlFor={filter.name}>
                {filter.title} &#42;
              </StyledInputLabel>

              <StyledSelect
                name={filter.name}
                id={filter.name}
                className={showError ? css.errorBorder : ''}
                value={value ?? ''}
                onChange={(e) => handleChange(filter.name, e.target.value)}
                open={isOpen}
                onClose={handleClose}
                IconComponent={() =>
                  isOpen ? (
                    <GoChevronUp
                      className={css.icon}
                      style={{
                        color: getIconColor(showError, hasValue, isOpen),
                      }}
                    />
                  ) : (
                    <GoChevronDown
                      className={css.icon}
                      style={{
                        color: getIconColor(showError, hasValue, isOpen),
                      }}
                    />
                  )
                }
                MenuProps={menuStyles}
                hasValue={hasValue}
                hasError={showError && !isOpen}
                isOpen={isOpen}
                renderValue={(selected) => (
                  <span
                    style={{
                      color:
                        selected === ''
                          ? 'var(--grey-dark)'
                          : 'var(--default-black)',
                    }}
                  >
                    {selected === ''
                      ? `Оберіть ${filter.title.toLowerCase()}`
                      : selected}
                  </span>
                )}
                displayEmpty
              >
                {filter.values?.map((val) => (
                  <Options
                    key={`${filter.name}-${val.id}-${val.value}`}
                    value={val.value}
                  >
                    {val.value}
                  </Options>
                ))}
              </StyledSelect>

              {showError && (
                <p className={css.errorText}>
                  Вибір &#171;{filter.title}&#187; є обовʼязковим
                </p>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
