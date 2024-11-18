import SummaryCart from '../SummaryCart/SummaryCart';
import ShoppingCart from '../ShoppingCart/ShoppingCart';
import css from './CartAndSummary.module.css';

export default function CartAndSummary() {
  return (
    <div className={css.cart_box}>
      <div className={css.shoppingbox}>
        <h3 className={css.title}>
          Предмети у вашому кошику <span className={css.span_title}>(4)</span>
        </h3>
        <div className={css.select_all}>
          <input type="checkbox" className={css.checkbox} />
          <p className={css.select_text}>Виділити все</p>
        </div>

        <div className={css.scrollbox}>
          <div className={css.scrollbox_inner}>
            <ul className={css.cart_list}>
              <ShoppingCart />
            </ul>
          </div>
        </div>
      </div>
      <SummaryCart />
    </div>
  );
}
