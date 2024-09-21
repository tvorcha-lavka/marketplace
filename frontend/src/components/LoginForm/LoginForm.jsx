import { useState, useId } from 'react';
//import { useDispatch } from 'react-redux';
//import { logIn } from '../../redux/auth/operations';
import { Formik, Form, Field } from 'formik';
import clsx from 'clsx';
import { useModal } from '../../hooks/useModal';
import FormImgComponent from '../FormImgComponent/FormImgComponent';
import SocialAuthComponent from '../SocialAuthComponent/SocialAuthComponent';
import { schema } from '../../utils/formSchema';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa6';
import css from '../LoginForm/LoginForm.module.css';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState('password');
  const [authError, setAuthError] = useState(false);
  const [invalidFields, setInvalidFields] = useState({
    emailOrPhone: false,
    password: false,
  });

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

  const togglePassInput = () => {
    setType(showPassword ? 'password' : 'text');
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values, actions) => {
    console.log('Form Submitted:', values);

    const isAuthenticated = await fakeAuthCheck(
      values.emailOrPhone,
      values.password
    );

    const emailOrPhoneValid =
      values.emailOrPhone === 'registered@example.com' ||
      values.emailOrPhone === '+380999999999';
    const passwordValid = values.password === 'password123';

    if (!emailOrPhoneValid || !passwordValid) {
      setAuthError(true);
      setInvalidFields({
        emailOrPhone: !emailOrPhoneValid,
        password: !passwordValid,
      });
      return;
    }

    setAuthError(false);
    actions.resetForm();
    setInvalidFields({ emailOrPhone: false, password: false });
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

        <SocialAuthComponent />

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
                    invalidFields.emailOrPhone && css.formInputError
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
                      invalidFields.password && css.formInputError
                    )}
                    type={type}
                    placeholder="нп.dianasetter"
                  />

                  {showPassword ? (
                    <FiEye
                      name="password"
                      id={`${id}-password`}
                      onClick={togglePassInput}
                      className={clsx(css.fiEye, authError && css.iconError)}
                    />
                  ) : (
                    <FiEyeOff
                      name="password"
                      id={`${id}-password`}
                      onClick={togglePassInput}
                      className={clsx(css.fiEyeOff, authError && css.iconError)}
                    />
                  )}
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
