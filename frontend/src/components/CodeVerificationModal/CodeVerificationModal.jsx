import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useId, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useModal } from '../../hooks/useModal';
import { selectLoading, selectUser } from '../../redux/auth/selectors';
import { registerComplete, verifyCode } from '../../redux/auth/operations';
import FormImgComponent from '../FormImgComponent/FormImgComponent';
import ResendCodeBtn from '../ResendCodeBtn/ResendCodeBtn';
import Loader from '../Loader/Loader';
import { codeSchema } from '../../utils/formSchema';
import { LuArrowLeft } from 'react-icons/lu';
import css from './CodeVerificationModal.module.css';

const CodeVerificationModal = ({ type }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [authError, setAuthError] = useState(false);

  const isLoading = useSelector(selectLoading);
  const email = useSelector(selectUser);
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const id = useId();

  const getDescription = () => {
    return type === 'verification-register'
      ? 'На вашу електронну пошту надіслано код підтвердження. Введіть його нижче, щоб завершити реєстрацію'
      : 'Введіть унікальний 6-значний код, який був висланий на ваш e-mail';
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

      if (newOtp.every((digit) => digit !== '')) {
        handleSubmit({ code: newOtp }, { resetForm: () => {} });
      }

      if (value && index < otp.length - 1) {
        document.getElementById(`${id}-code-${index + 1}`).focus();
      }
    }
  };

  const handlePaste = (e, setFieldValue) => {
    const pasteData = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split('').slice(0, 6);
      setOtp(newOtp);
      newOtp.forEach((value, index) => {
        document.getElementById(`${id}-code-${index}`).value = value;
      });
      setFieldValue('code', newOtp);

      handleSubmit({ code: newOtp }, { resetForm: () => {} });
    }
  };

  const handleSubmit = (values, actions) => {
    const code = values.code.join('');

    localStorage.setItem('verifyResetCode', code);

    let dispatchAction;

    if (type === 'verification-register') {
      dispatchAction = registerComplete({ code, email });
    } else if (type === 'verification-reset') {
      dispatchAction = verifyCode({ code, email });
    } else {
      return;
    }

    dispatch(dispatchAction)
      .unwrap()
      .then(() => {
        setAuthError(false);
        actions.resetForm();
        setOtp(Array(6).fill(''));

        if (type === 'verification-register') {
          openModal('confirmation-modal', { type });
          localStorage.removeItem('ResendRegisterCode');
          localStorage.removeItem('verifyResetCode');
        } else if (type === 'verification-reset') {
          openModal('change-pwd');
        }
      })
      .catch((e) => {
				setAuthError(true);
				return thunkAPI.rejectWithValue(e.message);
      });
  };

  const handleBack = () => {
    openModal(
      type === 'verification-register' ? 'register' : 'forgot-password'
    );
  };

  return (
    <div className={css.container}>
      <FormImgComponent />

      {isLoading ? (
        <Loader />
      ) : (
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
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form>
                <div>
                  <div
                    onPaste={(e) => handlePaste(e, setFieldValue)}
                    className={css.codeInputWrapper}
                  >
                    {otp.map((value, index) => (
                      <label key={index} htmlFor={`${id}-code-${index}`}>
                        <Field
                          id={`${id}-code-${index}`}
                          type="text"
                          maxLength="1"
                          value={otp[index]}
                          onChange={(e) =>
                            handleChange(e, index, setFieldValue)
                          }
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

                <ResendCodeBtn type={type} />
              </Form>
            )}
          </Formik>
          <Link to="/support" className={css.supportLink}>
            Потрібна допомога?
          </Link>
        </div>
      )}
    </div>
  );
};

export default CodeVerificationModal;

CodeVerificationModal.propTypes = {
  type: PropTypes.oneOf(['verification-register', 'verification-reset'])
    .isRequired,
};
