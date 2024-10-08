import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useId, useState, useEffect, useRef } from 'react';
import { Formik, Field, Form } from 'formik';
import clsx from 'clsx';
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

  const inputRefs = useRef([]);

  const getDescription = () => {
    return type === 'verification-register'
      ? 'На вашу електронну пошту надіслано код підтвердження. Введіть його нижче, щоб завершити реєстрацію'
      : 'Введіть унікальний 6-значний код, який був висланий на ваш e-mail';
  };

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const focusFirstEmptyInput = () => {
    const firstEmptyIndex = otp.findIndex((value) => value === '');
    if (firstEmptyIndex !== -1) {
      setTimeout(() => {
        inputRefs.current[firstEmptyIndex].focus();
      }, 300);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value) {
        const nextEmptyIndex = newOtp.indexOf('');
        if (nextEmptyIndex !== -1) {
          setTimeout(() => {
            inputRefs.current[nextEmptyIndex].focus();
          }, 300);
        } else {
          handleSubmit({ code: newOtp }, { resetForm: () => {} });
        }
      }
    }
  };

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        if (otp[index]) {
          handleChange({ target: { value: '' } }, index);
        } else if (index > 0) {
          handleChange({ target: { value: '' } }, index - 1);
          setTimeout(() => {
            inputRefs.current[index - 1].focus();
          }, 300);
        }
        break;
      case 'Delete':
        e.preventDefault();
        handleChange({ target: { value: '' } }, index);
        break;
      default:
        break;
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      newOtp.forEach((value, index) => {
        inputRefs.current[index].value = value;
        if (index < otp.length - 1) {
          setTimeout(() => {
            inputRefs.current[index + 1].focus();
          }, 300);
        }
      });

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

          localStorage.removeItem('verifyResetCode');
        } else if (type === 'verification-reset') {
          openModal('change-pwd');
        }
      })
      .catch((e) => {
        setAuthError(true);
        console.error('Code verification:', e.message);
        actions.resetForm();
        setOtp(Array(6).fill(''));
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
                          value={value}
                          innerRef={(elem) => (inputRefs.current[index] = elem)}
                          onChange={(e) => handleChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onClick={focusFirstEmptyInput}
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
