import { useEffect, useState } from 'react';
import CustomButton from '../../CustomButton/CustomButton';
import css from './CustomerData.module.css';

export default function CustomerData() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const isFormValid = () => {
    return (
      name.trim() !== '' &&
      surname.trim() !== '' &&
      phone.trim() !== '' &&
      email.trim() !== ''
    );
  };

  useEffect(() => {
    setIsButtonEnabled(isFormValid());
  }, [name, surname, phone, email]);

  return (
    <section className={css.section}>
      <h2 className={css.title}>1. Дані замовника</h2>
      <form className={css.form}>
        <div className={css.form_wrapper}>
          <label htmlFor="name" className={css.inline}>
            Імя&#42;
            <input
              id="name"
              type="text"
              value={name}
              className={css.form_input}
              placeholder="Валерія"
              required
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </label>
          <label className={css.inline}>
            Прізвище&#42;
            <input
              type="text"
              value={surname}
              className={css.form_input}
              placeholder="Петрівна"
              required
              onChange={(e) => setSurname(e.currentTarget.value)}
            />
          </label>
        </div>
        <div className={css.form_wrapper}>
          <label className={css.inline}>
            Номер телефону&#42;
            <input
              type="tel"
              value={phone}
              className={css.form_input_row}
              placeholder="+ 38 (067) 112-45-45"
              required
              onChange={(e) => setPhone(e.currentTarget.value)}
            />
          </label>
          <label className={css.inline}>
            E-mail адреса&#42;
            <input
              type="email"
              value={email}
              className={css.form_input_row}
              placeholder="val23@gmail.com"
              required
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </label>
        </div>
        <button
          type="button"
          className={css.btn_continue}
          disabled={!isButtonEnabled}
        >
          Продовжити
        </button>
      </form>
    </section>
  );
}
