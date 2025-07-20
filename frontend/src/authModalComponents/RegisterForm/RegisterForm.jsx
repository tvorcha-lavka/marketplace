import { useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import Loader from '../Loader/Loader';
import FormImgComponent from '../FormImgComponent/FormImgComponent';
import SocialAuthComponent from '../SocialAuthComponent/SocialAuthComponent';
import CustomButton from '../../components/ButtonElements/CustomButton/CustomButton';
import EmailField from '../../components/FormElements/EmailField/EmailField';
import PasswordField from '../../components/FormElements/PasswordField/PasswordField';
import showToast from '../../components/Toasts/showToast';

import { useModal } from '../../hooks/useModal';
import { selectLoading } from '../../redux/auth/selectors';
import { schema } from '../../utils/formSchema';
import { register } from '../../redux/auth/operations';

import css from '../RegisterForm/RegisterForm.module.css';

export default function RegisterForm() {
  const id = useId();
  const isLoading = useSelector(selectLoading);
  const { openModal } = useModal();
  const dispatch = useDispatch();

  const handleSubmit = async (values, actions) => {
    const newUser = {
      email: values.email,
      password: values.password,
    };

    dispatch(register(newUser))
      .unwrap()
      .then(() => {
        actions.resetForm();
        openModal('verification-register');
      })
      .catch((e) => {
        if (e === 'Request failed with status code 307') {
          actions.resetForm();
          openModal('verification-register');
        } else {
          showToast(
            'Спробуйте зареєструватись з іншою електронною адресою',
            'error'
          );
        }
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
              email: '',
              password: '',
            }}
            onSubmit={handleSubmit}
            validationSchema={schema}
          >
            {({ setFieldValue, values, errors }) => (
              <Form>
                <EmailField
                  id={id}
                  inputWidth="368px"
                  label="Електронна пошта"
                  values={values}
                  errors={errors}
                />

                <PasswordField
                  id={id}
                  values={values}
                  setFieldValue={setFieldValue}
                  label="Пароль"
                  inputWidth="368px"
                />

                <p className={css.privacyText}>
                  Натискаючи &#x201C;Зареєструватись&#x201D; ви приймаєте
                  Правила користування сайтом
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
                  Зареєструватись
                </CustomButton>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}
