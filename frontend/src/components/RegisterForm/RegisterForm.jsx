import { useState, useId } from 'react';
//import { useDispatch } from 'react-redux';
//import { register } from '../../redux/auth/operations';
import { Formik, Form, Field } from 'formik';
import clsx from 'clsx';
import { useModal } from '../../hooks/useModal';
import FormImgComponent from '../../components/FormImgComponent/FormImgComponent';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa6';
import SocialAuthComponent from '../SocialAuthComponent/SocialAuthComponent';
import {
  PwdStrengthLength,
  getStrengthLabel,
} from '../PwdStrengthLength/PwdStrengthLength';
import { schema } from '../../utils/formSchema';
import css from '../RegisterForm/RegisterForm.module.css';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(true);
  const [type, setType] = useState('password');
  const [strengthLabel, setStrengthLabel] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const { openModal } = useModal();
  //const dispatch = useDispatch();

  const onSubmit = (values, actions) => {
    const newUser = {
      emailOrPhone: values.emailOrPhone,
      password: values.password,
      userRemember: values.userRemember,
    };

    if (!newUser.emailOrPhone || !newUser.password) {
      console.error('Missing required fields');
      return;
    }

    // dispatch(register(newUser))
    //   .unwrap()
    //   .then(() => {
    setShowInfo(false);
    setStrengthLabel({ label: '', color: '', lines: 0 });
    actions.resetForm();
    // })
    // .catch((error) => {
    //   console.error('Dispatch error:', error);
    // });
  };

  const id = useId();

  const togglePassInput = () => {
    setType(showPassword ? 'text' : 'password');
    setShowPassword(!showPassword);
  };

  return (
    <div className={css.container}>
      <FormImgComponent />
      <div className={css.formWrapper}>
        <ul className={css.headerWrapper}>
          <li className={css.headerWrapLogin}>
            <button
              type="button"
              onClick={() => openModal('login')}
              className={css.headerBtn}
            >
              Вхід
            </button>
          </li>
          <li className={css.headerWrapRegister}>
            <button
              type="button"
              onClick={() => openModal('register')}
              className={css.headerBtnActive}
            >
              Реєстрація
            </button>
          </li>
        </ul>
        <SocialAuthComponent />
        <Formik
          initialValues={{
            emailOrPhone: '',
            password: '',
            userRemember: false,
          }}
          onSubmit={onSubmit}
          validationSchema={schema}
        >
          {({ setFieldValue, isValid, dirty, values }) => (
            <Form className={css.form}>
              <div className={css.inputWrapEmail}>
                <label
                  className={css.inputLabel}
                  htmlFor={`${id}-emailOrPhone`}
                >
                  Електронна пошта/ номер телефону{' '}
                  <span className={css.requiredSymb}>&#42;</span>
                </label>

                <Field
                  id={`${id}-emailOrPhone`}
                  name="emailOrPhone"
                  type="emailOrPhone"
                  className={clsx(
                    css.formInput,
                    values.emailOrPhone && css.filled
                  )}
                  placeholder="нп.dianasetter@gmail.com"
                  autoComplete="off"
                />
              </div>

              <div className={css.pwdInputWrap}>
                <label className={css.inputLabel} htmlFor={`${id}-password`}>
                  Пароль <span className={css.requiredSymb}>&#42;</span>
                </label>

                <div className={css.pwdInput}>
                  <Field
                    id={`${id}-password`}
                    type={type}
                    name="password"
                    className={clsx(
                      css.formInput,
                      values.password && css.filled
                    )}
                    placeholder="нп.dianasetter"
                    autoComplete="off"
                    onChange={(e) => {
                      const password = e.target.value;
                      setFieldValue('password', password);
                      if (password === '') {
                        setStrengthLabel('');
                        setShowInfo(false);
                      } else {
                        const strength = getStrengthLabel(password);
                        setStrengthLabel(strength);
                        setShowInfo(true);
                      }
                    }}
                  />

                  {showPassword ? (
                    <FiEyeOff
                      name="password"
                      id={`${id}-password`}
                      className={css.fiEyeOff}
                      onClick={togglePassInput}
                    />
                  ) : (
                    <FiEye
                      name="password"
                      id={`${id}-password`}
                      className={css.fiEye}
                      onClick={togglePassInput}
                    />
                  )}
                </div>

                {showInfo && (
                  <PwdStrengthLength strengthLabel={strengthLabel} />
                )}
              </div>
              {showInfo && (
                <p className={css.additionalInfo}>
                  Пароль має складатись з мін. 8 та макс. 30 символів, цифр і
                  спеціальних знаків
                </p>
              )}

              <div className={css.rememberCheckbox}>
                <Field
                  className={css.visuallyHidden}
                  id={`${id}-userRemember`}
                  name="userRemember"
                  type="checkbox"
                />
                <label
                  className={css.rememberCheckboxLabel}
                  htmlFor={`${id}-userRemember`}
                >
                  <span className={css.userRememberComponentIcon}>
                    <FaCheck className={css.checkmarkIcon} />
                  </span>
                  <span className={css.rememberText}>
                    Запам&#x2019;ятай мене
                  </span>
                </label>
              </div>

              <p className={css.privacyText}>
                Натискаючи &#x201C;Зареєструватись&#x201D; ви приймаєте Правила
                користування сайтом
              </p>
              <button
                className={css.styledButton}
                type="submit"
                disabled={!(isValid && dirty)}
                onClick={() => openModal('verification-register')}
              >
                Зареєструватись
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
