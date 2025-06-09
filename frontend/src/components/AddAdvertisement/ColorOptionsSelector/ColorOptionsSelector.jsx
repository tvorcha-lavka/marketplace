import css from './ColorOptionsSelector.module.css';

export default function ColorOptionsSelector({
  filtersDescription,
  selectedColors,
  setSelectedColors,
}) {
  const colorFilter = filtersDescription?.find(
    (filter) => filter.name === 'color'
  );

  const handleColorClick = (id) => {
    setSelectedColors((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((colorId) => colorId !== id);
      }
      if (prevSelected.length < 2) {
        return [...prevSelected, id];
      }
      return prevSelected;
    });
  };

  return (
    <fieldset className={css.wrapper}>
      <h3 className={css.title}>Виберіть до 2 кольорів</h3>
      <div className={css.colorGrid}>
        {colorFilter?.values.map(({ id, value, metadata }) => {
          const isSelected = selectedColors.includes(id);
          const borderStyle = metadata?.border
            ? `var(--border-width) var(--border-style) var(--dote-border-color)`
            : 'none';

          return (
            <button
              key={id}
              type="button"
              className={`${css.colorButton} ${isSelected ? css.selected : ''}`}
              onClick={() => handleColorClick(id)}
            >
              <span className={css.label}>{value}</span>
              <span
                className={css.colorDot}
                style={{
                  backgroundColor: metadata?.hex_code || '#ccc',
                  border: borderStyle,
                }}
              />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
