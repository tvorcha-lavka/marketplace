import { useId } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Formik, Form, Field } from 'formik';
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

  const handleSubmit = (values, actions) => {
    dispatch(forgotPassword({email: values.email }))
      .unwrap()
      .then(() => {
        actions.resetForm();
        openModal('verification-reset');
      })
			.catch((e) => {
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
            {({ isValid, dirty, values }) => (
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
                  disabled={!(isValid && dirty)}
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
