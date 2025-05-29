import RecommendedCards from '../../components/RecommendedCards/RecommendedCards';
import ShoppingCart from '../../components/Cart/ShoppingCart/ShoppingCart';
import SummaryCart from '../../components/Cart/SummaryCart/SummaryCart';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

import css from './CartPage.module.css';

export default function CartPage() {
  return (
    <section className="container">
      <div className={`${css.section} section`}>
        <Breadcrumbs
          links={[
            { label: 'Головна', to: '/', isActive: false },
            { label: 'Кошик', to: '/cart', isActive: true },
          ]}
        />

        <div className={css.cartAndSummary}>
          <ShoppingCart />
          <SummaryCart />
        </div>
        <RecommendedCards />
      </div>
    </section>
  );
}
