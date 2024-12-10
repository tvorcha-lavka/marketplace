import css from './Sort.module.css';

export default function Sort() {
  return (
    <section className={css.sort_section}>
      <div className={css.wrapper}>
        <div className={css.count}>
          <p>Знайдено 138 товарів</p>
        </div>
        <div className={css.sortbox}>
          <div className={css.price}>
            <label htmlFor="price">Сортувати за:</label>
            <select name="price" id="price" default="min">
              <option value="min">Найнижча ціна</option>
              <option value="max">Найвища ціна</option>
            </select>
          </div>
          <div className={css.number}>
            <label htmlFor="number">Показувати по:</label>
            <select name="number" id="number" default="min">
              <option value="min">24</option>
              <option value="max">30</option>
              <option value="max">50</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
