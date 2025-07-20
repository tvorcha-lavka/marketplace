import ProductCardDetails from '../../components/ProductCard/ProductCardDetails/ProductCardDetails';

import css from './CardDetailsPage.module.css';

export default function CardDetailsPage() {
  return (
    <section className="container">
      <div className={`${css.wrap} section`}>
        <ProductCardDetails />
      </div>
    </section>
  );
}
