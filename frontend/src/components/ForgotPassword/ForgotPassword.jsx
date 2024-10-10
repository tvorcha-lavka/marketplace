import { useId } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import { useModal } from '../../hooks/useModal';
import { selectLoading } from '../../redux/auth/selectors';
import { forgotPassword } from '../../redux/auth/operations';
import Loader from '../Loader/Loader';
import FormImgComponent from '../../components/FormImgComponent/FormImgComponent';
import { forgotPasswordSchema } from '../../utils/formSchema';
import { LuArrowLeft } from 'react-icons/lu';
import css from './ForgotPassword.module.css';

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);
  const { openModal } = useModal();
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
                <div className={css.inputWrapEmail}>
                  <label htmlFor={`${id}-email`}>
                    <Field
                      id={`${id}-email`}
                      name="email"
                      type="email"
                      className={clsx(
                        css.formInput,
                        values.email && css.filled
                      )}
                      placeholder="example@gmail.com"
                      autoComplete="off"
                    />
                  </label>
                </div>

                <button
                  className={css.styledButton}
                  disabled={!values.email || !!errors.email}
                  type="submit"
                >
                  Надіслати посилання
                </button>
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
}
