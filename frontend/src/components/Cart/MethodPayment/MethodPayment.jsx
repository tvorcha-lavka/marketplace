import css from './MethodPayment.module.css';

export default function MethodPayment() {
  return (
    <section className={css.payment_section}>
      <div className={css.payment_option}>
        <input
          type="radio"
          id="ligpay"
          name="paymentData"
          value="ligpay"
          // checked={paymentData.type === 'ligpay'}
          // onChange={() => handlePaymentTypeChange('ligpay')}
        />
        <label htmlFor="ligpay">
          LiqPay (Кредитна карта, Google/Apple pay)
        </label>
      </div>
      <div className={css.payment_option}>
        <input
          type="radio"
          id="imposed_payment"
          name="paymentData"
          value="imposed_payment"
          // checked={paymentData.type === 'imposed_payment'}
          // onChange={() => handlePaymentTypeChange('imposed_payment')}
        />
        <label htmlFor="imposed_payment">Накладений платіж</label>
      </div>
    </section>
  );
}
