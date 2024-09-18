import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import { useModal } from '../../hooks/useModal';
import FormImgComponent from '../../components/FormImgComponent/FormImgComponent';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import css from './ChangePwdModal.module.css';
import { styled } from '@mui/material/styles';

export const StrengthLength = styled('div')(({ bgcolor }) => ({
  backgroundColor: bgcolor,
}));

const schema = Yup.object({
  password: Yup.string().min(8).max(30).required(),
});

export default function ChangePwdModal() {
  const [showPassword, setShowPassword] = useState(true);
  const [types, setType] = useState('password');
  const [strengthLabel, setStrengthLabel] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const onSubmit = (values, actions) => {
    const newUser = {
      password: values.password,
    };

    if (!newUser.password) {
      console.error('Missing required fields');
      return;
    }

    openModal('confirmation-modal', { type: 'verification-reset' });
    setShowInfo(false);
    setStrengthLabel({ label: '', color: '', lines: 0 });
    actions.resetForm();
  };

  const { openModal } = useModal();

  const id = useId();

  const togglePassInput = () => {
    setType(showPassword ? 'text' : 'password');
    setShowPassword(!showPassword);
  };

  const getStrengthLabel = (password) => {
    const length = password.length;
    if (length < 8)
      return { label: 'Слабкий пароль', color: '#EA1119', lines: 1 };
    if (length < 12)
      return { label: 'Помірно складний пароль', color: '#E77034', lines: 2 };
    return { label: 'Надійний пароль', color: '#4D9C63', lines: 3 };
  };

  return (
    <div className={css.container}>
      <FormImgComponent />
      <div className={css.pageContent}>
        <h2 className={css.title}>Введіть новий пароль</h2>
        <p className={css.additionalInfo}>
          Створіть новий пароль для вашого акаунту.
        </p>

        <Formik
          initialValues={{
            password: '',
          }}
          onSubmit={onSubmit}
          validationSchema={schema}
        >
          {({ setFieldValue, isValid, dirty, values }) => (
            <Form className={css.form}>
              <div className={css.pwdInputWrap}>
                <div className={css.pwdLabelWrap}>
                  <label className={css.inputLabel} htmlFor="password">
                    Новий пароль <span className={css.requiredSymb}>&#42;</span>
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
                    placeholder="нп.dianasetter"
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
                  <div className={css.pwdStrengthContainer}>
                    <div>
                      <div className={css.strengthLengthWrap}>
                        {Array.from({ length: strengthLabel.lines }).map(
                          (_, index) => (
                            <StrengthLength
                              className={css.pwdStrengthLength}
                              key={index}
                              bgcolor={strengthLabel.color}
                            />
                          )
                        )}
                      </div>
                    </div>
                    <span className={css.strengthLabel}>
                      {strengthLabel.label}
                    </span>
                  </div>
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
    </div>
  );
}

