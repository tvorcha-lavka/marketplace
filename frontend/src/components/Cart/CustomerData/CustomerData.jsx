import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LiaEditSolid } from 'react-icons/lia';

import CustomButton from '../../CustomButton/CustomButton';

import { selectCartStep } from '../../../redux/cart/cartSelector';
import {
  updateCustomerData,
  nextStep,
  previousStep,
} from '../../../redux/cart/cartSlice';

import css from './CustomerData.module.css';

export default function CustomerData() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
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
      /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ-]+$/i.test(name.trim()) &&
      /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ-]+$/i.test(surname.trim()) &&
      /^(\+38)?0[0-9]{9}$/.test(phone.trim()) &&
      /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email.trim());

    setIsButtonEnabled(isFormValid());
  }, [name, surname, phone, email]);

  const validateField = (field, value) => {
    if (!value.trim()) {
      return;
    }
    switch (field) {
      case 'name':
      case 'surname':
        if (!/^[a-zA-Zа-яА-ЯіїєґІЇЄҐ-]+$/i.test(value.trim())) {
          return 'Використовувати лише букви, можуть бути розділені дефісом.';
        }
        break;
      case 'phone':
        if (!/^(\+38)?0[0-9-]{9}$/.test(value.trim())) {
          return 'Можна використовувати лише цифри та "+" на початку.';
        }
        break;
      case 'email':
        if (
          !/^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(
            value.trim()
          )
        ) {
          return 'Невірний формат email. Наприклад: example@mail.com';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (field, value) => {
    const error = validateField(field, value);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });

    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'surname':
        setSurname(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'email':
        setEmail(value);
        break;
      default:
        break;
    }
  };

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
    localStorage.removeItem('customerData');
  };

  return (
    <div className={css.section}>
      {step === 1 ? (
        <>
          <h2 className={css.title}>1. Дані замовника</h2>
          <form className={css.form}>
            <div className={css.formWrapper}>
              <div className={css.tooltip}>
                <label htmlFor="name" className={css.inline}>
                  Ім&#8217;я&#42;
                  <input
                    id="name"
                    type="text"
                    list="nameList"
                    value={name}
                    className={css.formInput}
                    placeholder="Валерія"
                    onChange={(e) =>
                      handleChange('name', e.currentTarget.value)
                    }
                    required
                  />
                  {errors.name && (
                    <div className={css.error}>{errors.name}</div>
                  )}
                  <datalist id="nameList">
                    {savedData.map((data, index) => (
                      <option key={index} value={data.name}>
                        {data.name}
                      </option>
                    ))}
                  </datalist>
                </label>
              </div>
              <div className={css.tooltip}>
                <label className={css.inline}>
                  Прізвище&#42;
                  <input
                    type="text"
                    list="surnameList"
                    value={surname}
                    className={css.formInput}
                    placeholder="Петрівна"
                    onChange={(e) =>
                      handleChange('surname', e.currentTarget.value)
                    }
                    required
                  />
                  {errors.surname && (
                    <div className={css.error}>{errors.surname}</div>
                  )}
                  <datalist id="surnameList">
                    {savedData.map((data, index) => (
                      <option key={index} value={data.surname}>
                        {data.surname}
                      </option>
                    ))}
                  </datalist>
                </label>
              </div>
            </div>
            <div className={css.formWrapper}>
              <div className={css.tooltip}>
                <label className={css.inline}>
                  Номер телефону&#42;
                  <input
                    type="tel"
                    list="phoneList"
                    value={phone}
                    className={css.formInputRow}
                    placeholder="+ 38 (067) 112-45-45"
                    onChange={(e) =>
                      handleChange('phone', e.currentTarget.value)
                    }
                    required
                  />
                  {errors.phone && (
                    <div className={css.error}>{errors.phone}</div>
                  )}
                  <datalist id="phoneList">
                    {savedData.map((data, index) => (
                      <option key={index} value={data.phone}>
                        {data.phone}
                      </option>
                    ))}
                  </datalist>
                </label>
              </div>
              <div className={css.tooltip}>
                <label className={css.inline}>
                  E-mail адреса&#42;
                  <input
                    type="email"
                    list="browsers"
                    value={email}
                    className={css.formInputRow}
                    placeholder="val23@gmail.com"
                    onChange={(e) =>
                      handleChange('email', e.currentTarget.value)
                    }
                    required
                  />
                  {errors.email && (
                    <div className={css.error}>{errors.email}</div>
                  )}
                  <datalist id="emailList">
                    {savedData.map((data, index) => (
                      <option key={index} value={data.email}>
                        {data.email}
                      </option>
                    ))}
                  </datalist>
                </label>
              </div>
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
          <div className={css.titleBox}>
            <h2 className={css.title}>1. Дані замовника</h2>
            <button
              type="button"
              className={css.editBtn}
              onClick={handleStepBack}
            >
              <p className={css.edit}>Редагувати</p>
              <LiaEditSolid size={16} />
            </button>
          </div>

          <p className={css.text}>
            Ім&#8217;я та прізвище:&nbsp;
            <span className={css.userData}>
              {customerData.surname}&nbsp;
              {customerData.name}
            </span>
          </p>

          <p className={css.text}>
            Номер телефону:&nbsp;
            <span className={css.userData}>{customerData.phone}</span>
          </p>
          <p className={css.text}>
            E-mail адреса:&nbsp;
            <span className={css.userData}>{customerData.email}</span>
          </p>
        </>
      )}
    </div>
  );
}
