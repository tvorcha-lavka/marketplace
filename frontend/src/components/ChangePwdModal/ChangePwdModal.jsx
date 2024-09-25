import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import clsx from 'clsx';
import { useModal } from '../../hooks/useModal';
import { resetPassword } from '../../redux/auth/operations';
import { selectLoading, selectUser } from '../../redux/auth/selectors';
import Loader from '../Loader/Loader';
import FormImgComponent from '../../components/FormImgComponent/FormImgComponent';
import {
  PwdStrengthLength,
  getStrengthLabel,
} from '../PwdStrengthLength/PwdStrengthLength';
import { passwordSchema } from '../../utils/formSchema';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import css from './ChangePwdModal.module.css';

export default function ChangePwdModal() {
  const [showPassword, setShowPassword] = useState(true);
  const [types, setType] = useState('password');
  const [strengthLabel, setStrengthLabel] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const isLoading = useSelector(selectLoading);
  const email = useSelector(selectUser);
  const { openModal } = useModal();
  const id = useId();
  const dispatch = useDispatch();
  const verifyCode = localStorage.getItem('verifyResetCode');

  const togglePassInput = () => {
    setType(showPassword ? 'text' : 'password');
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, actions) => {
    const newPwd = values.password;

    function resetFormData() {
      setShowInfo(false);
      setStrengthLabel({ label: '', color: '', lines: 0 });
      actions.resetForm();
    }

    dispatch(
      resetPassword({ email: email, code: verifyCode, password: newPwd })
    )
      .unwrap()
      .then(() => {
        openModal('confirmation-modal', { type: 'verification-reset' });
				resetFormData();
				localStorage.removeItem('verifyResetCode');
      })
      .catch((e) => {
				resetFormData();
				return thunkAPI.rejectWithValue(e.message);
      });
  };

  return (
    <div className={css.container}>
      <FormImgComponent />

      {isLoading ? (
        <Loader />
      ) : (
        <div className={css.pageContent}>
          <h2 className={css.title}>Введіть новий пароль</h2>
          <p className={css.additionalInfo}>
            Створіть новий пароль для вашого акаунту
          </p>

          <Formik
            initialValues={{
              password: '',
            }}
            onSubmit={handleSubmit}
            validationSchema={passwordSchema}
          >
            {({ setFieldValue, isValid, dirty, values }) => (
              <Form>
                <div className={css.pwdInputWrap}>
                  <div className={css.pwdLabelWrap}>
                    <label className={css.inputLabel} htmlFor="password">
                      Новий пароль{' '}
                      <span className={css.requiredSymb}>&#42;</span>
                    </label>
                  </div>

                  <div className={css.pwdInput}>
                    <Field
                      id={`${id}-password`}
                      type={types}
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
                  <p className={css.info}>
                    Пароль має складатись з мін. 8 та макс. 30 символів, цифр і
                    спеціальних знаків
                  </p>
                )}

                <button
                  className={css.styledButton}
                  type="submit"
                  disabled={!(isValid && dirty)}
                >
                  Готово
                </button>

                <Link to="/support" className={css.supportLink}>
                  Потрібна допомога?
                </Link>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}
