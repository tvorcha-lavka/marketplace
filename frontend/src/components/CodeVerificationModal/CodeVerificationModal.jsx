import { Link } from 'react-router-dom';
import { useId, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useModal } from '../../hooks/useModal';
import FormImgComponent from '../FormImgComponent/FormImgComponent';
import { codeSchema } from '../../utils/formSchema';
import { LuArrowLeft } from 'react-icons/lu';
import css from './CodeVerificationModal.module.css';

const CodeVerificationModal = ({ type }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [authError, setAuthError] = useState(false);

  const { openModal } = useModal();
  const id = useId();

  const getDescription = () => {
    if (type === 'verification-register') {
      return 'На вашу електронну пошту надіслано код пітвердження. Ведіть його нижче,щоб завершити реєстрацію';
    }
    if (type === 'verification-reset') {
      return 'Введіть унікальний 6-значний код, який був висланий на ваш e-mail.';
    }
    return '';
  };

  const fakeAuthCheck = async (code) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return code === '123456';
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`${id}-code-${index - 1}`).focus();
    }
  };

  const handleChange = (e, index, setFieldValue) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setFieldValue('code', newOtp);
      if (value && index < otp.length - 1) {
        document.getElementById(`${id}-code-${index + 1}`).focus();
      }
    }
  };

  const onSubmit = async (values, actions) => {
    const isAuthenticated = await fakeAuthCheck(values.code.join(''));
    console.log('Confirmation code:', values.code.join(''));
    if (isAuthenticated) {
      if (type === 'verification-register') {
        openModal('confirmation-modal', { type });
      } else if (type === 'verification-reset') {
        openModal('change-pwd');
      }
    } else {
      console.error('Невірний код');
      setAuthError(true);
      return;
    }
    setAuthError(false);
    actions.resetForm();
    setOtp(Array(6).fill(''));
  };

  const handleBack = () => {
    if (type === 'verification-register') {
      openModal('register');
    } else if (type === 'verification-reset') {
      openModal('forgot-password');
    }
  };

  return (
    <div className={css.container}>
      <FormImgComponent />
      <div className={css.pageContent}>
        <div className={css.backLinkWrap}>
          <button onClick={handleBack} className={css.backLink}>
            <LuArrowLeft className={css.arrowIcon} /> Повернутись назад
          </button>
        </div>
        <h2 className={css.title}>Введіть код</h2>
        <p className={css.info}>{getDescription()}</p>

        <Formik
          initialValues={{ code: otp }}
          validationSchema={codeSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue }) => (
            <Form className={css.form}>
              <div>
                <div className={css.codeInputWrapper}>
                  {otp.map((value, index) => (
                    <label key={index} htmlFor={`${id}-code-${index}`}>
                      <Field
                        id={`${id}-code-${index}`}
                        type="text"
                        maxLength="1"
                        value={value}
                        onChange={(e) => handleChange(e, index, setFieldValue)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={clsx(
                          css.input,
                          value !== '' && css.filled,
                          authError && css.inputError
                        )}
                        autoComplete="off"
                      />
                    </label>
                  ))}
                </div>
                {authError && (
                  <p className={css.additionalInfo}>
                    Введено неправильний код. Спробуйте ще раз
                  </p>
                )}
              </div>
              <button type="submit" className={css.submitButton}>
                Повторно наділасти код
              </button>
            </Form>
          )}
        </Formik>
        <Link to="/support" className={css.supportLink}>
          Потрібна допомога?
        </Link>
      </div>
    </div>
  );
};

export default CodeVerificationModal;

CodeVerificationModal.propTypes = {
  type: PropTypes.oneOf(['verification-register', 'verification-reset'])
    .isRequired,
};
