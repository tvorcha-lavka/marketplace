import { useState } from 'react';

import {
  StyledInputLabel,
  StyledSelect,
  Options,
  menuStyles,
  StyledIndicator,
  StyledSelectWrapper,
} from './FiltersSection.styled';

import css from './FiltersSection.module.css';

export default function FiltersSection({
  filtersDescription,
  selectedFilters,
  setSelectedFilters,
}) {
  const [openSelect, setOpenSelect] = useState(null);
  const [touchedFilters, setTouchedFilters] = useState({});
  const [focused, setFocused] = useState(false);

  const handleChange = (name, value) => {
    const updatedFilters = { ...selectedFilters, [name]: value };
    setSelectedFilters(updatedFilters);
    setTouchedFilters((prev) => ({ ...prev, [name]: true }));
  };

  const handleClose = () => {
    setOpenSelect(null);
  };

  const renderValue = (selected, title) => (
    <span
      style={{
        color: selected === '' ? 'var(--grey-dark)' : 'var(--default-black)',
      }}
    >
      {selected === '' ? `Оберіть ${title.toLowerCase()}` : selected}
    </span>
  );

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
            <StyledSelectWrapper
              key={filter.name}
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
                value={value ?? ''}
                onChange={(e) => handleChange(filter.name, e.target.value)}
                open={isOpen}
                inputProps={{
                  'aria-label': isOpen
                    ? 'Закрити список фільтрів'
                    : 'Відкрити список фільтрів',
                }}
                onClose={handleClose}
                onFocus={() =>
                  setFocused((prev) => ({ ...prev, [filter.name]: true }))
                }
                onBlur={() =>
                  setFocused((prev) => ({ ...prev, [filter.name]: false }))
                }
                IconComponent={() => null}
                endAdornment={
                  <StyledIndicator
                    className="indicator"
                    focused={focused[filter.name] || false}
                    hasError={showError}
                    hasValue={hasValue}
                    isOpen={isOpen}
                  />
                }
                MenuProps={menuStyles}
                hasValue={hasValue}
                hasError={showError && !isOpen}
                isOpen={isOpen}
                renderValue={(selected) => renderValue(selected, filter.title)}
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
            </StyledSelectWrapper>
          );
        })}
      </div>
    </fieldset>
  );
}
