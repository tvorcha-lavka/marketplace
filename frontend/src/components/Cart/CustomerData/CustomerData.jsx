import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { useState, useEffect } from 'react';

import CustomButton from '../../ButtonElements/CustomButton/CustomButton';
import FormField from '../../FormElements/FormField/FormField';
import CardNumberField from '../../FormElements/CardNumberField/CardNumberField';
import EmailField from '../../FormElements/EmailField/EmailField';
import CustomEditButton from '../../ButtonElements/CustomEditButton/CustomEditButton';

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

  const [isPersistValid, setIsPersistValid] = useState(false);

  useEffect(() => {
    validationSchema
      .isValid(customerData)
      .then((valid) => setIsPersistValid(valid))
      .catch(() => setIsPersistValid(false));
  }, [customerData]);

  const handleSubmit = (values) => {
    dispatch(updateCustomerData(values));
    dispatch(nextStep());
  };

  const handleStepBack = () => dispatch(previousStep());

  return (
    <div className={css.section}>
      {step === 1 ? (
        <>
          <h2 className={css.title}>1. Дані отримувача</h2>
          <Formik
            initialValues={customerData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isValid, dirty, touched, errors, values }) => (
              <Form className={css.form}>
                <div className={css.formWrapper}>
                  <FormField
                    id="customer_name"
                    name="name"
                    label="Імʼя"
                    placeholder="Валерія"
                    touched={touched}
                    errors={errors}
                    values={values}
                    inputWidth="317px"
                  />
                  <FormField
                    id="customer_surname"
                    name="surname"
                    label="Прізвище"
                    placeholder="Шевченко"
                    touched={touched}
                    errors={errors}
                    values={values}
                    inputWidth="317px"
                  />
                </div>

                <div className={css.formWrapper}>
                  <CardNumberField
                    id="customer_phone"
                    name="phone"
                    label="Номер телефону"
                    placeholder="+38 (067) 112-45-45"
                    touched={touched}
                    errors={errors}
                    values={values}
                    inputWidth="317px"
                  />
                  <EmailField
                    id="customer_email"
                    label="E-mail адреса"
                    touched={touched}
                    errors={errors}
                    values={values}
                    inputWidth="317px"
                  />
                </div>

                <CustomButton
                  className={css.btnContinue}
                  size="small"
                  type="submit"
                  disabled={!(isValid && dirty) && !isPersistValid}
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
            <CustomEditButton onClick={handleStepBack}>
              Редагувати дані
            </CustomEditButton>
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
