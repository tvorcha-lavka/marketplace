import DropdownCustomInput from '../../FormElements/DropdownCustomInput/DropdownCustomInput';

import css from './FiltersSection.module.css';

export default function FiltersSection({
  filtersDescription,
  selectedFilters,
  setSelectedFilters,
}) {
  const handleChange = (name, value) => {
    const updatedFilters = { ...selectedFilters, [name]: value };
    setSelectedFilters(updatedFilters);
  };

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>Додайте характеристики</h3>

      <div className={css.detailbox}>
        {filtersDescription?.map((filter) => {
          if (filter.name === 'color') return null;

          const value = selectedFilters[filter.name];

          return (
            <DropdownCustomInput
              key={filter.name}
              label={filter.title}
              value={value}
              placeholder={`Оберіть ${filter.title.toLowerCase()}`}
              onChange={(val) => handleChange(filter.name, val.value)}
              options={filter.values.map(({ id, value }) => ({
                id,
                label: value,
                value,
              }))}
              disabled={false}
              mode="list"
              editable={false}
              inputWidth="373px"
            />
          );
        })}
      </div>
    </fieldset>
  );
}
