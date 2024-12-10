import css from './MethodPayment.module.css';

export default function MethodPayment() {
  return (
    <section className={css.payment_section}>
      <h2 className={css.title}>3. Спосіб оплати</h2>
      <div className={css.payment_option}>
        <input
          type="radio"
          id="ligpay"
          name="payment"
          value="ligpay"
          // checked={payment.type === 'ligpay'}
          // onChange={() => handlePaymentTypeChange('ligpay')}
        />
        <label htmlFor="ukrposhta">
          LiqPay (Кредитна карта, Google/Apple pay)
        </label>
      </div>
      <div className={css.payment_option}>
        <input
          type="radio"
          id="imposed_payment"
          name="payment"
          value="imposed_payment"
          // checked={payment.type === 'imposed_payment'}
          // onChange={() => handlePaymentTypeChange('imposed_payment')}
        />
        <label htmlFor="imposed_payment">Накладений платіж</label>
      </div>
    </section>
  );
}
