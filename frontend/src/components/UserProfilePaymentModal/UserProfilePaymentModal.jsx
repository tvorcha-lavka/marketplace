import { useState } from 'react';
import { Formik, Form } from 'formik';

import ToggleButton from '../ButtonElements/ToggleButton/ToggleButton';
import CustomButton from '../ButtonElements/CustomButton/CustomButton';
import CardNumberField from '../FormElements/CardNumberField/CardNumberField';

import { cardSchema } from '../../utils/formSchema';

import css from './UserProfilePaymentModal.module.css';

export default function UserProfilePaymentModal({ onSubmit }) {
  const [isMain, setIsMain] = useState(false);

  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>Нова платіжна картка</h2>

      <Formik
        initialValues={{
          card_number: '',
          card_expire: '',
          card_cvv: '',
          card_holder: '',
        }}
        validationSchema={cardSchema}
        onSubmit={(values) => {
          onSubmit({ ...values, isMain });
        }}
      >
        {({ touched, errors, values, isValid, dirty }) => (
          <Form>
            <CardNumberField
              id="card_number"
              name="card_number"
              type="text"
              label="Номер карти"
              placeholder="3456 4444 4444 4444"
              touched={touched}
              errors={errors}
              values={values}
              inputWidth="342px"
            />
            <div className={css.flexWrap}>
              <CardNumberField
                id="card_expire"
                name="card_expire"
                type="text"
                maxLength={3}
                label="Термін дії"
                placeholder="02/2025"
                touched={touched}
                errors={errors}
                values={values}
                inputWidth="165px"
              />
              <CardNumberField
                id="card_cvv"
                name="card_cvv"
                type="text"
                maxLength={3}
                label="CVV"
                placeholder="000"
                touched={touched}
                errors={errors}
                values={values}
                inputWidth="165px"
              />
            </div>
            <CardNumberField
              id="card_holder"
              name="card_holder"
              type="text"
              label="Власник картки"
              placeholder="Шевченко Валерія"
              touched={touched}
              errors={errors}
              values={values}
              inputWidth="342px"
            />

            <div className={css.flexWrap}>
              <ToggleButton
                isSwitchActive={isMain}
                onClick={() => setIsMain((prev) => !prev)}
                label="Основна картка"
              />
            </div>

            <CustomButton
              type="submit"
              size="auto"
              variant="default"
              className={css.addBtn}
              disabled={!isValid || !dirty}
            >
              Додати картку
            </CustomButton>
          </Form>
        )}
      </Formik>
    </div>
  );
}
