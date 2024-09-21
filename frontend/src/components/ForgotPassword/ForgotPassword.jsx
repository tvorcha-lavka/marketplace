import { useId } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Formik, Form, Field } from 'formik';
import { useModal } from '../../hooks/useModal';
import FormImgComponent from '../../components/FormImgComponent/FormImgComponent';
import { forgotPasswordSchema } from '../../utils/formSchema';
import { LuArrowLeft } from 'react-icons/lu';
import css from './ForgotPassword.module.css';

export default function ForgotPassword() {
  const onSubmit = (values, actions) => {
    const value = {
      emailOrPhone: values.emailOrPhone,
    };

    if (!value.emailOrPhone) {
      console.error('Missing required fields');
      return;
    }
    actions.resetForm();
  };

  const { openModal } = useModal();
  const id = useId();

  return (
    <div className={css.container}>
      <FormImgComponent />
      <div className={css.pageContent}>
        <div className={css.backLinkWrap}>
          <button onClick={() => openModal('login')} className={css.backLink}>
            <LuArrowLeft className={css.arrowIcon} /> Повернутись назад
          </button>
        </div>
        <h2 className={css.title}>Введіть свій e-mail/ номер телефону</h2>
        <p className={css.additionalInfo}>
          Ми надішлемо вам код для скидання паролю.
        </p>
        <Formik
          initialValues={{
            emailOrPhone: '',
          }}
          onSubmit={onSubmit}
          validationSchema={forgotPasswordSchema}
        >
          {({ isValid, dirty, values }) => (
            <Form className={css.form}>
              <div className={css.inputWrapEmail}>
                <label htmlFor={`${id}-emailOrPhone`}>
                  <Field
                    id={`${id}-emailOrPhone`}
                    name="emailOrPhone"
                    type="emailOrPhone"
                    className={clsx(
                      css.formInput,
                      values.emailOrPhone && css.filled
                    )}
                    placeholder="нп.dianasetter@gmail.com"
                    autoComplete="off"
                  />
                </label>
              </div>

              <button
                className={css.styledButton}
                disabled={!(isValid && dirty)}
                type="submit"
                onClick={() => openModal('verification-reset')}
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
    </div>
  );
}
