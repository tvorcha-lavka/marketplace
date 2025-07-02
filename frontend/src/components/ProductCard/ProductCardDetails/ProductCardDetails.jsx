import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import RecommendedCards from '../../RecommendedCards/RecommendedCards';
import CardDetailsGallery from '../CardDetailsGallery/CardDetailsGallery';
import CardDetailsDescription from '../CardDetailsDescription/CardDetailsDescription';
import ProductDetailsInfo from '../ProductDetailsInfo/ProductDetailsInfo';
import Owner from '../Owner/Owner';
import Delivery from '../Delivery/Delivery';
import Payment from '../Payment/Payment';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';

import { getProductsId } from '../../../redux/products/operations';
import { selectProductDetails } from '../../../redux/products/selectors';
import { selectCategoryById } from '../../../redux/categories/categoriesSelectors';

import css from './ProductCardDetails.module.css';

export default function ProductCardDetails() {
  const { categoryId, cardId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || 'direct';
  const prevFrom = location.state?.from;
  const searchResults = location.state?.searchResults;

  const product = useSelector(selectProductDetails);
  const category = useSelector(selectCategoryById);

  useEffect(() => {
    if (cardId) {
      dispatch(getProductsId(cardId));
    }
  }, [dispatch, cardId]);

  // BREADCRUMBS FOR PRODUCT DETAILS CARD
  const links = [];

  if (from === 'main') {
    links.push({ label: 'Головна', to: '/', isActive: false });
  }

  if (from === 'categories') {
    links.push({
      label: category?.title || 'Категорія',
      to: `/categories/${categoryId}`,
      isActive: false,
    });
  }

  if (location.state?.from === 'search') {
    links.push({ label: 'Головна', to: '/', isActive: false });
  }

  if (from === 'recommended') {
    if (prevFrom === 'main') {
      links.push({ label: 'Головна', to: '/', isActive: false });
    }

    if (prevFrom === 'categories') {
      links.push({
        label: category?.title || 'Категорія',
        to: `/categories/${categoryId}`,
        isActive: false,
      });
    }

    if (prevFrom === 'recommended') {
      links.push({ label: 'Головна', to: '/', isActive: false });
      links.push({
        label: 'Повернутись назад',
        to: '',
        isActive: false,
        isButton: true,
        onClick: () => navigate(-1),
      });
    }
  }

  links.push({
    label: product?.title || 'Товар',
    to: `/${cardId}`,
    isActive: true,
  });

  return (
    <>
      {product && (
        <section>
          <Breadcrumbs links={links} />

          <div className={css.container}>
            <div className={css.galleryContainer}>
              <CardDetailsGallery product={product} />

              <CardDetailsDescription product={product} />
            </div>

            <div className={css.productDetails}>
              <ProductDetailsInfo product={product} />

              <div className={css.sellerInfo}>
                <Owner product={product} />
              </div>

              <div className={css.delivery}>
                <Delivery />
              </div>

              <div className={css.paymentInfo}>
                <Payment />
              </div>
            </div>
          </div>

          <RecommendedCards
            searchResults={searchResults}
            title="Вам також може сподобатись:"
          />
        </section>
      )}
    </>
  );
}
