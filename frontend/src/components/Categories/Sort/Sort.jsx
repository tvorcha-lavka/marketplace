import css from './Sort.module.css';

export default function Sort() {
  return (
    <div className={css.sortSection}>
      <div className={css.wrapper}>
        <div className={css.count}>
          <p>Знайдено 138 товарів</p>
        </div>
        <div className={css.sortbox}>
          <div className={css.price}>
            <label className={css.label} htmlFor="price">
              Сортувати за:
            </label>
            <select
              label
              className={css.select}
              name="price"
              id="price"
              default="min"
            >
              <option className={css.option} value="min">
                Найнижча ціна
              </option>
              <option className={css.option} value="max">
                Найвища ціна
              </option>
            </select>
          </div>
          <div className={css.number}>
            <label label className={css.label} htmlFor="number">
              Показувати по:
            </label>
            <select
              className={css.select}
              name="number"
              id="number"
              default="min"
            >
              <option className={css.option} value="min">
                24
              </option>
              <option className={css.option} value="max">
                48
              </option>
              <option className={css.option} value="max">
                96
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
