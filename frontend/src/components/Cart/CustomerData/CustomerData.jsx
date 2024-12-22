import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LiaEditSolid } from 'react-icons/lia';
import {
  updateCustomerData,
  nextStep,
  previousStep,
} from '../../../redux/cart/cartSlice';
import { selectCartStep } from '../../../redux/cart/cartSelector';
import CustomButton from '../../CustomButton/CustomButton';
import css from './CustomerData.module.css';

export default function CustomerData() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const step = useSelector(selectCartStep);
  const dispatch = useDispatch();
  const customerData = useSelector((state) => state.cart.customerData);

  useEffect(() => {
    const isFormValid = () =>
      name.trim() && surname.trim() && phone.trim() && email.trim();

    setIsButtonEnabled(isFormValid());
  }, [name, surname, phone, email]);

  const handleSubmit = () => {
    dispatch(updateCustomerData({ name, surname, phone, email }));
    dispatch(nextStep());
  };

  return (
    <section className={css.section}>
      {step === 1 ? (
        <>
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
            <CustomButton
              className={css.btnContinue}
              size="small"
              type="button"
              onClick={handleSubmit}
              disabled={!isButtonEnabled}
            >
              Продовжити
            </CustomButton>
          </form>
        </>
      ) : (
        <>
          <div className={css.titlebox}>
            <h2 className={css.title}>1. Дані замовника</h2>
            <button
              type="button"
              className={css.editbtn}
              onClick={() => dispatch(previousStep())}
            >
              <p className={css.edit}>Редагувати</p>
              <LiaEditSolid size={16} />
            </button>
          </div>

          <p className={css.text}>
            Ім’я та прізвище:&nbsp;
            <span>
              {customerData.surname}&nbsp;
              {customerData.name}
            </span>
          </p>

          <p className={css.text}>
            Номер телефону:&nbsp;
            <span>{customerData.phone}</span>
          </p>
          <p className={css.text}>
            E-mail адреса:&nbsp;
            <span>{customerData.email}</span>
          </p>
        </>
      )}
    </section>
  );
}
