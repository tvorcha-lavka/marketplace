import css from './CustomerData.module.css';

export default function CustomerData() {
  return (
    <section className={css.section}>
      <h2 className={css.title}>1. Дані замовника</h2>
      <form className={css.form}>
        <div className={css.form_wrapper}>
          <label htmlFor="name" className={css.inline}>
            Імя&#42;
            <input
              id="name"
              type="name"
              className={css.form_input}
              placeholder="Валерія"
              required
            />
          </label>
          <label className={css.inline}>
            Прізвище&#42;
            <input
              type="secondName"
              className={css.form_input}
              placeholder="Петрівна"
              required
            />
          </label>
        </div>
        <div className={css.form_wrapper}>
          <label className={css.inline}>
            Номер телефону&#42;
            <input
              type="tel"
              className={css.form_input_row}
              placeholder="+ 38 (067) 112-45-45"
              required
            />
          </label>
          <label className={css.inline}>
            E-mail адреса&#42;
            <input
              type="email"
              className={css.form_input_row}
              placeholder="val23@gmail.com"
              required
            />
          </label>
        </div>
        <button type="button" className={css.btn_continue}>
          Продовжити
        </button>
      </form>
    </section>
  );
}
