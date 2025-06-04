import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { LiaEditSolid } from 'react-icons/lia';

import CustomButton from '../../CustomButton/CustomButton';
import FormField from '../FormField/FormField';

import {
  updateCustomerData,
  nextStep,
  previousStep,
} from '../../../redux/basket/slice';
import {
  selectCustomerData,
  selectCartStep,
} from '../../../redux/basket/selectors';
import { validationSchema } from '../../../utils/formSchema';

import css from './CustomerData.module.css';

export default function CustomerData() {
  const dispatch = useDispatch();
  const step = useSelector(selectCartStep);
  const customerData = useSelector(selectCustomerData);

	const handleSubmit = (values) => {
		console.log('Submitted values:', values);
    dispatch(updateCustomerData(values));
    dispatch(nextStep());
  };

  const handleStepBack = () => dispatch(previousStep());

  return (
    <div className={css.section}>
      {step === 1 ? (
        <>
          <h2 className={css.title}>1. Дані замовника</h2>
          <Formik
            initialValues={{
              name: '',
              surname: '',
              phone: '',
              email: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid, dirty, touched, errors }) => (
              <Form className={css.form}>
                <div className={css.formWrapper}>
                  <FormField
                    id="customer"
                    name="name"
                    label="Ім’я"
                    type="text"
                    placeholder="Валерія"
                    touched={touched}
                    errors={errors}
                  />

                  <FormField
                    id="customer"
                    name="surname"
                    type="text"
                    label="Прізвище"
                    placeholder="Шевченко"
                    touched={touched}
                    errors={errors}
                  />
                </div>

                <div className={css.formWrapper}>
                  <FormField
                    id="customer"
                    name="phone"
                    type="phone"
                    label="Номер телефону"
                    placeholder="+38 067 1234567"
                    touched={touched}
                    errors={errors}
                    maxLength={13}
                  />

                  <FormField
                    id="customer"
                    name="email"
                    type="email"
                    label="E-mail адреса"
                    placeholder="example@gmail.com"
                    touched={touched}
                    errors={errors}
                  />
                </div>

                <CustomButton
                  className={css.btnContinue}
                  size="small"
                  type="submit"
                  disabled={!(isValid && dirty)}
                >
                  Продовжити
                </CustomButton>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <>
          <div className={css.titleBox}>
            <h2 className={css.title}>1. Дані замовника</h2>
            <button
              type="button"
              className={css.editBtn}
              onClick={handleStepBack}
            >
              <p className={css.edit}>Редагувати</p>
              <LiaEditSolid size={16} />
            </button>
          </div>

          <p className={css.text}>
            Ім&#8217;я та прізвище:&nbsp;
            <span className={css.userData}>
              {customerData.surname}&nbsp;{customerData.name}
            </span>
          </p>
          <p className={css.text}>
            Номер телефону:&nbsp;
            <span className={css.userData}>{customerData.phone}</span>
          </p>
          <p className={css.text}>
            E-mail адреса:&nbsp;
            <span className={css.userData}>{customerData.email}</span>
          </p>
        </>
      )}
    </div>
  );
}
