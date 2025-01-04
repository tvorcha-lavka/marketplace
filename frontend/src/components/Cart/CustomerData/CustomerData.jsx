import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LiaEditSolid } from 'react-icons/lia';
import CustomButton from '../../CustomButton/CustomButton';
import {
  updateCustomerData,
  nextStep,
  previousStep,
} from '../../../redux/cart/cartSlice';
import { selectCartStep } from '../../../redux/cart/cartSelector';
import css from './CustomerData.module.css';

export default function CustomerData() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [savedData, setSavedData] = useState([]);
  const step = useSelector(selectCartStep);
  const dispatch = useDispatch();
  const customerData = useSelector((state) => state.cart.customerData);

  useEffect(() => {
    const storedData =
      JSON.parse(localStorage.getItem('customerDataHistory')) || [];
    setSavedData(storedData);
  }, []);

  useEffect(() => {
    const isFormValid = () =>
      name.trim() && surname.trim() && phone.trim() && email.trim();

    setIsButtonEnabled(isFormValid());
  }, [name, surname, phone, email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const customerData = { name, surname, phone, email };

    dispatch(updateCustomerData(customerData));
    const updatedData = [...savedData, customerData];
    localStorage.setItem('customerDataHistory', JSON.stringify(updatedData));
    setSavedData(updatedData);

    dispatch(nextStep());
  };

  const handleStepBack = () => {
    dispatch(previousStep());
    resetData();
  };

  const resetData = () => {
    setName('');
    setSurname('');
    setPhone('');
    setEmail('');
    // localStorage.removeItem('customerData');
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
                  list="nameList"
                  value={name}
                  className={css.form_input}
                  pattern="^[a-zA-Zа-яА-ЯіїєґІЇЄҐ-]+$"
                  title="Тільки букви, можуть бути розділені дефісом."
                  placeholder="Валерія"
                  required
                  onChange={(e) => setName(e.currentTarget.value)}
                />
                <datalist id="nameList">
                  {savedData.map((data, index) => (
                    <option key={index} value={data.name}>
                      {data.name}
                    </option>
                  ))}
                </datalist>
              </label>
              <label className={css.inline}>
                Прізвище&#42;
                <input
                  type="text"
                  list="surnameList"
                  value={surname}
                  className={css.form_input}
                  pattern="^[a-zA-Zа-яА-ЯіїєґІЇЄҐ-]+$"
                  title="Тільки букви, можуть бути розділені дефісом."
                  placeholder="Петрівна"
                  required
                  onChange={(e) => setSurname(e.currentTarget.value)}
                />
                <datalist id="surnameList">
                  {savedData.map((data, index) => (
                    <option key={index} value={data.surname}>
                      {data.surname}
                    </option>
                  ))}
                </datalist>
              </label>
            </div>
            <div className={css.form_wrapper}>
              <label className={css.inline}>
                Номер телефону&#42;
                <input
                  type="tel"
                  list="phoneList"
                  value={phone}
                  className={css.form_input_row}
                  pattern="^\+?[0-9-]+$"
                  title="Тільки цифри, дефіси, дужки, знак +."
                  placeholder="+ 38 (067) 112-45-45"
                  required
                  onChange={(e) => setPhone(e.currentTarget.value)}
                />
                <datalist id="phoneList">
                  {savedData.map((data, index) => (
                    <option key={index} value={data.phone}>
                      {data.phone}
                    </option>
                  ))}
                </datalist>
              </label>
              <label className={css.inline}>
                E-mail адреса&#42;
                <input
                  type="email"
                  list="browsers"
                  value={email}
                  className={css.form_input_row}
                  pattern="^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$"
                  title="Введіть правильний email. Наприклад: user@example.com."
                  placeholder="val23@gmail.com"
                  required
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
                <datalist id="emailList">
                  {savedData.map((data, index) => (
                    <option key={index} value={data.email}>
                      {data.email}
                    </option>
                  ))}
                </datalist>
              </label>
            </div>

            <CustomButton
              className={css.btnContinue}
              size="small"
              type="submit"
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
              onClick={handleStepBack}
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
