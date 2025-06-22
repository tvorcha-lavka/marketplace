import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { LiaEditSolid } from 'react-icons/lia';
import { useState, useEffect } from 'react';

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
                    id="customer"
                    name="name"
                    label="Імʼя"
                    type="text"
                    placeholder="Валерія"
                    touched={touched}
                    errors={errors}
                    values={values}
                  />

                  <FormField
                    id="customer"
                    name="surname"
                    type="text"
                    label="Прізвище"
                    placeholder="Шевченко"
                    touched={touched}
                    errors={errors}
                    values={values}
                  />
                </div>

                <div className={css.formWrapper}>
                  <FormField
                    id="customer"
                    name="phone"
                    type="phone"
                    label="Номер телефону"
                    placeholder="+38 (067) 112-45-45"
                    touched={touched}
                    errors={errors}
                    maxLength={13}
                    values={values}
                  />

                  <FormField
                    id="customer"
                    name="email"
                    type="email"
                    label="E-mail адреса"
                    placeholder="example@gmail.com"
                    touched={touched}
                    errors={errors}
                    values={values}
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
            <button
              type="button"
              className={css.editBtn}
              onClick={handleStepBack}
            >
              Редагувати дані
              <span>
                <LiaEditSolid className={css.editIcon} />
              </span>
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
