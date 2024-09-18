import { useState, useId } from 'react';
//import { useDispatch } from 'react-redux';
//import { logIn } from '../../redux/auth/operations';
import { Formik, Form, Field } from 'formik';
import clsx from 'clsx';
import * as Yup from 'yup';
import { useModal } from '../../hooks/useModal';
import FormImgComponent from '../FormImgComponent/FormImgComponent';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa6';
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import css from '../LoginForm/LoginForm.module.css';

export const getIconEyeOnStyle = (authError) => ({
  stroke: authError ? '#D33232' : '#b1b1b1',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
});

export const getIconEyeOffStyle = (authError) => ({
  stroke: authError ? '#D33232' : '#414141',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
});

const schema = Yup.object({
  emailOrPhone: Yup.string()
    .required()
    .test(function (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const uaPhoneRegex = /^\+380[0-9]{9}$/; 
      const plPhoneRegex = /^\+48[0-9]{9}$/; 
      const dePhoneRegex = /^\+49[1-9][0-9]{1,14}$/; 
      const nlPhoneRegex = /^\+31[0-9]{9}$/; 
      const gbPhoneRegex = /^\+44[1-9][0-9]{9,10}$/; 

      return (
        emailRegex.test(value) ||
        uaPhoneRegex.test(value) ||
        plPhoneRegex.test(value) ||
        dePhoneRegex.test(value) ||
        nlPhoneRegex.test(value) ||
        gbPhoneRegex.test(value)
      );
    }),
  password: Yup.string().min(8).max(30).required(),
  userRemember: Yup.boolean(),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState('password');
  const [authError, setAuthError] = useState(false);

  const { openModal } = useModal();
  const id = useId();
  //const dispatch = useDispatch();

  const fakeAuthCheck = async (emailOrPhone, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return (
      emailOrPhone === 'registered@example.com' ||
      ('+380999999999' && password === 'password123')
    );
  };

  const onSubmit = async (values, actions) => {
    console.log('Form Submitted:', values);
    const isAuthenticated = await fakeAuthCheck(
      values.emailOrPhone,
      values.password,
      values.userRemember
    );

    if (!isAuthenticated) {
      setAuthError(true);
      return;
    }

    setAuthError(false);
    actions.resetForm();
  };

  const togglePassInput = () => {
    setType(showPassword ? 'password' : 'text');
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
              className={css.headerBtnActive}
            >
              Вхід
            </button>
          </li>
          <li className={css.headerWrapRegister}>
            <button
              type="button"
              onClick={() => openModal('register')}
              className={css.headerBtn}
            >
              Реєстрація
            </button>
          </li>
        </ul>
        <ul className={css.socialButtons}>
          <li>
            <button type="button" className={css.socialButton}>
              <FaFacebook className={css.facebookIcon} />
              Facebook
            </button>
          </li>
          <li>
            <button type="button" className={css.socialButton}>
              <FcGoogle className={css.googleIcon} />
              Google
            </button>
          </li>
        </ul>
        <span className={css.divider}>або</span>

        <Formik
          initialValues={{
            emailOrPhone: '',
            password: '',
            userRemember: false,
          }}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ values, isValid, dirty }) => (
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
                    values.emailOrPhone && css.filled,
                    authError && css.formInputError
                  )}
                  placeholder="нп.dianasetter@gmail.com"
                  autoComplete="off"
                />
              </div>

              <div className={css.pwdInputWrap}>
                <div className={css.pwdLabelWrap}>
                  <label className={css.inputLabel} htmlFor={`${id}-password`}>
                    Пароль <span className={css.requiredSymb}>&#42;</span>
                  </label>
                  <button
                    onClick={() => openModal('forgot-password')}
                    className={css.resetPwd}
                  >
                    Забули пароль?
                  </button>
                </div>

                <div className={css.pwdInput}>
                  <Field
                    id={`${id}-password`}
                    name="password"
                    className={clsx(
                      css.formInput,
                      values.password && css.filled,
                      authError && css.formInputError
                    )}
                    type={type}
                    placeholder="нп.dianasetter"
                  />

                  <div className={css.positionPwdIconEye}>
                    {showPassword ? (
                      <FiEye
                        name="password"
                        id={`${id}-password`}
                        onClick={togglePassInput}
                        style={getIconEyeOffStyle(authError)}
                      />
                    ) : (
                      <FiEyeOff
                        name="password"
                        id={`${id}-password`}
                        onClick={togglePassInput}
                        style={getIconEyeOnStyle(authError)}
                      />
                    )}
                  </div>
                </div>

                {authError && (
                  <p className={css.additionalInfo}>
                    Введено невірні дані. Будь ласка, перевірте свої дані та
                    спробуйте знову.
                  </p>
                )}
              </div>

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
                Натискаючи &#x201C;Увійти&#x201D; ви приймаєте умови Публічного
                договору (Оферти) про надання послуг
              </p>
              <button
                className={css.styledButton}
                type="submit"
                disabled={!(isValid && dirty)}
              >
                Увійти
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

