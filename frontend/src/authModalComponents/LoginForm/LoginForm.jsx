import { useState, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';

import Loader from '../Loader/Loader';
import FormImgComponent from '../FormImgComponent/FormImgComponent';
import SocialAuthComponent from '../SocialAuthComponent/SocialAuthComponent';
import CustomButton from '../../components/ButtonElements/CustomButton/CustomButton';
import EmailField from '../../components/FormElements/EmailField/EmailField';
import PasswordField from '../../components/FormElements/PasswordField/PasswordField';
import CheckboxInput from '../../components/FormElements/CheckboxInput/CheckboxInput';

import { logIn } from '../../redux/auth/operations';
import { useModal } from '../../hooks/useModal';
import { selectLoading } from '../../redux/auth/selectors';
import { schema } from '../../utils/formSchema';

import css from '../LoginForm/LoginForm.module.css';

export default function LoginForm() {
  const [authError, setAuthError] = useState(false);
  const [inputError, setInputError] = useState({
    email: false,
    password: false,
  });

  const isLoading = useSelector(selectLoading);
  const { openModal, closeModal } = useModal();
  const id = useId();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openForgotPasswordModal = () => {
    closeModal();
    openModal('forgot-password');
  };

  const handleSubmit = async (values, actions) => {
    setInputError({ email: false, password: false });

    const user = {
      email: values.email,
      password: values.password,
      remember_me: values.remember_me,
    };

    dispatch(logIn(user))
      .unwrap()
      .then(() => {
        setAuthError(false);
        actions.resetForm();
        closeModal();
        navigate('/');
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
              email: '',
              password: '',
              remember_me: false,
            }}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ errors, values, setFieldValue }) => (
              <Form>
                <EmailField
                  id={id}
                  label="Електронна пошта"
                  errors={errors}
                  values={values}
                  inputWidth="368px"
                />

                <PasswordField
                  id="login"
                  name="password"
                  label="Пароль"
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  inputError={inputError}
                  showLabel
                  showForgotPasswordLink
                  onForgotPasswordClick={openForgotPasswordModal}
                  customErrorMessage={
                    authError &&
                    'Введено невірні дані. Будь ласка, перевірте свої дані та спробуйте знову.'
                  }
                  showStrengthLabel={false}
                  showAdditionalInfo={false}
                  inputWidth="368px"
                />

                <Field
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  label="Запам&#x2019;ятай мене"
                  as={CheckboxInput}
                />

                <p className={css.privacyText}>
                  Натискаючи &#x201C;Увійти&#x201D; ви приймаєте умови
                  Публічного договору (Оферти) про надання послуг
                </p>

                <CustomButton
                  size="auto"
                  type="submit"
                  disabled={
                    !values.email ||
                    !values.password ||
                    !!errors.email ||
                    !!errors.password
                  }
                >
                  Увійти
                </CustomButton>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}
