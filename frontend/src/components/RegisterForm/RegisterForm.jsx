import { useState, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/auth/operations';
import { Formik, Form, Field } from 'formik';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useModal } from '../../hooks/useModal';
import { selectLoading, selectUser } from '../../redux/auth/selectors';
import Loader from '../Loader/Loader';
import FormImgComponent from '../../components/FormImgComponent/FormImgComponent';
import { FiEye, FiEyeOff } from 'react-icons/fi';
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

  const isLoading = useSelector(selectLoading);
  const { openModal } = useModal();
  const dispatch = useDispatch();
  const id = useId();

  const handleSubmit = async (values, actions) => {
    const newUser = {
      email: values.email,
      password: values.password,
    };

    function resetFormData() {
      setShowInfo(false);
      setStrengthLabel({ label: '', color: '', lines: 0 });
      actions.resetForm();
    }

    const saveToLocalStorage = (email, password) => {
      localStorage.setItem('emailForResendRegisterCode', email);
      localStorage.setItem('passwordForResendRegisterCode', password);
    };

    const confirmRegister = () => {
      resetFormData();
      openModal('verification-register');
    };

    dispatch(register(newUser))
      .unwrap()
      .then(() => {
        saveToLocalStorage(newUser.email, newUser.password);
        confirmRegister();
      })
      .catch((e) => {
        if (e === 'Request failed with status code 307') {
          saveToLocalStorage(newUser.email, newUser.password);
          confirmRegister();
        } else {
          resetFormData();
          toast('Користувач з такою поштою вже зареєстрований');
        }
      });
  };

  const togglePassInput = () => {
    setType(showPassword ? 'text' : 'password');
    setShowPassword(!showPassword);
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
              email: localStorage.getItem('emailForResendRegisterCode') || '',
              password:
                localStorage.getItem('passwordForResendRegisterCode') || '',
            }}
            onSubmit={handleSubmit}
            validationSchema={schema}
          >
            {({ setFieldValue, values, errors }) => (
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
                    className={clsx(css.formInput, values.email && css.filled)}
                    placeholder="example@gmail.com"
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
                      placeholder="password"
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

                <p className={css.privacyText}>
                  Натискаючи &#x201C;Зареєструватись&#x201D; ви приймаєте
                  Правила користування сайтом
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
                  Зареєструватись
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}
