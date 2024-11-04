import { useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import Loader from '../Loader/Loader';
import FormImgComponent from '../FormImgComponent/FormImgComponent';
import CustomButton from '../../components/CustomButton/CustomButton';
import PasswordField from '../PasswordField/PasswordField';

import { useModal } from '../../hooks/useModal';
import { resetPassword } from '../../redux/auth/operations';
import {
  selectLoading,
  selectUserEmail,
  selectVerificationCode,
} from '../../redux/auth/selectors';
import { passwordSchema } from '../../utils/formSchema';
import { handleSupportClick } from '../../utils/formUtils';

import css from './ChangePwdModal.module.css';

export default function ChangePwdModal() {
  const id = useId();
  const isLoading = useSelector(selectLoading);
  const email = useSelector(selectUserEmail);
  const verificationCode = useSelector(selectVerificationCode);
  const { openModal, closeModal } = useModal();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, actions) => {
    const newPwd = values.password;

    const payload = {
      password: newPwd,
      code: verificationCode,
      email,
    };

    dispatch(resetPassword(payload))
      .unwrap()
      .then(() => {
        actions.resetForm();
        openModal('confirmation-modal', { type: 'verification-reset' });
      })

      .catch((e) => {
        actions.resetForm();
        console.error('Change password failed:', e.message);
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
                <PasswordField
                  id={id}
                  values={values}
                  setFieldValue={setFieldValue}
                >
                  Новий пароль
                </PasswordField>

                <CustomButton
                  className={css.btn}
                  size="medium"
                  type="submit"
                  disabled={!(isValid && dirty)}
                >
                  Готово
                </CustomButton>

                <Link
                  to="#"
                  onClick={() => handleSupportClick(closeModal, navigate)}
                  className={css.supportLink}
                >
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
