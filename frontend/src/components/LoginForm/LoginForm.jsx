import { useState, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logIn } from '../../redux/auth/operations';
import { Formik, Form, Field } from 'formik';
import clsx from 'clsx';
import { useModal } from '../../hooks/useModal';
import { selectLoading } from '../../redux/auth/selectors';
import Loader from '../Loader/Loader';
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
  const [inputError, setInputError] = useState({
    email: false,
    password: false,
  });

  const isLoading = useSelector(selectLoading);
  const { openModal } = useModal();
  const id = useId();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const togglePassInput = () => {
    setType(showPassword ? 'password' : 'text');
    setShowPassword(!showPassword);
  };

  const openForgotPasswordModal = () => {
    openModal('login', false);
    openModal('forgot-password');
  };

  const handleSubmit = async (values, actions) => {
    setInputError({ email: false, password: false });

    const user = {
      email: values.email,
      password: values.password,
      userRemember: values.userRemember,
    };

    console.log(user);

    dispatch(logIn(user))
      .unwrap()
      .then(() => {
        setAuthError(false);
        actions.resetForm();
        closeModal();
        navigate('/private');
      })
      .catch((e) => {
        setAuthError(true);
        setInputError({ email: true, password: true });
        console.error('Login failed:', e.message);
      });
  };

  return (
    <div className={css.container}>
      <FormImgComponent />

      {isLoading ? (
        <Loader />
      ) : (
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
              email: localStorage.getItem('email') || '',
              password: localStorage.getItem('password') || '',
              userRemember: false,
            }}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values }) => (
              <Form>
                <div className={css.inputWrapEmail}>
                  <label className={css.inputLabel} htmlFor={`${id}-email`}>
                    Електронна пошта{' '}
                    <span className={css.requiredSymb}>&#42;</span>
                  </label>
                  <Field
                    id={`${id}-email`}
                    name="email"
                    type="email"
                    className={clsx(
                      css.formInput,
                      values.email && css.filled,
                      (errors.email && touched.email) || inputError.email
                        ? css.formInputError
                        : ''
                    )}
                    placeholder="example@gmail.com"
                    autoComplete="off"
                  />
                </div>

                <div className={css.pwdInputWrap}>
                  <div className={css.pwdLabelWrap}>
                    <label
                      className={css.inputLabel}
                      htmlFor={`${id}-password`}
                    >
                      Пароль <span className={css.requiredSymb}>&#42;</span>
                    </label>
                    <button
                      type="button"
                      onClick={openForgotPasswordModal}
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
                        (errors.password && touched.password) ||
                          inputError.password
                          ? css.formInputError
                          : ''
                      )}
                      type={type}
                      placeholder="password"
                      autoComplete="off"
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
                        className={clsx(
                          css.fiEyeOff,
                          authError && css.iconError
                        )}
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
                  Натискаючи &#x201C;Увійти&#x201D; ви приймаєте умови
                  Публічного договору (Оферти) про надання послуг
                </p>
                <button
                  className={css.styledButton}
                  type="submit"
                  disabled={
                    !values.email ||
                    !values.password ||
                    !!errors.email ||
                    !!errors.password
                  }
                >
                  Увійти
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}
