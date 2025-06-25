import { useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import toast from 'react-hot-toast';
import { LuArrowLeft } from 'react-icons/lu';

import Loader from '../Loader/Loader';
import FormImgComponent from '../FormImgComponent/FormImgComponent';
import CustomButton from '../../components/ButtonElements/CustomButton/CustomButton';
import EmailField from '../../components/FormElements/EmailField/EmailField';

import { useModal } from '../../hooks/useModal';
import { selectLoading } from '../../redux/auth/selectors';
import { forgotPassword } from '../../redux/auth/operations';
import { forgotPasswordSchema } from '../../utils/formSchema';
import { handleSupportClick } from '../../utils/formUtils';

import css from './ForgotPassword.module.css';

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectLoading);
  const { openModal, closeModal } = useModal();
  const id = useId();

  const handleSubmit = async (values, actions) => {
    const email = values.email;

    try {
      const res = await dispatch(forgotPassword({ email: email })).unwrap();

      if (res && res.email) {
        actions.resetForm();
        openModal('verification-reset');
      }
    } catch (e) {
      toast('Користувач з такою поштою не зареєстрований');
    }
  };

  return (
    <div className={css.container}>
      <FormImgComponent />

      {isLoading ? (
        <Loader />
      ) : (
        <div className={css.pageContent}>
          <div className={css.backLinkWrap}>
            <button onClick={() => openModal('login')} className={css.backLink}>
              <LuArrowLeft className={css.arrowIcon} /> Повернутись назад
            </button>
          </div>
          <h2 className={css.title}>Введіть свій e-mail</h2>
          <p className={css.additionalInfo}>
            Ми надішлемо вам унікальний код для скидання паролю
          </p>
          <Formik
            initialValues={{
              email: '',
            }}
            onSubmit={handleSubmit}
            validationSchema={forgotPasswordSchema}
          >
            {({ values, errors }) => (
              <Form>
                <EmailField
                  showLabel={false}
                  id={id}
                  values={values}
                  errors={errors}
                  inputWidth="368px"
                />

                <CustomButton
                  className={css.btn}
                  size="auto"
                  disabled={!values.email || !!errors.email}
                  type="submit"
                >
                  Надіслати посилання
                </CustomButton>
              </Form>
            )}
          </Formik>
          <Link
            to="#"
            onClick={() => handleSupportClick(closeModal, navigate)}
            className={css.supportLink}
          >
            Потрібна допомога?
          </Link>
        </div>
      )}
    </div>
  );
}
