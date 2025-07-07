import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CardCollection from '../CardCollection/CardCollection';
import CustomSlider from '../ButtonElements/CustomSlider/CustomSlider';
import RecommendedCardsSkeleton from './RecommendedCardsSkeleton';

import { getProducts } from '../../redux/products/operations';
import { selectProducts, selectLoading } from '../../redux/products/selectors';
import useDelayedLoading from '../../hooks/useDelayedLoading';

import css from './RecommendedCards.module.css';

export default function RecommendedCards({
  title = 'Вам також може сподобатись:',
}) {
  const [activeCardId, setActiveCardId] = useState(null);

  const dispatch = useDispatch();

  const productsData = useSelector(selectProducts);
  const isLoading = useSelector(selectLoading);
  const delayedLoading = useDelayedLoading(isLoading);

  const allProducts = useMemo(
    () => productsData?.results || [],
    [productsData?.results]
  );

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, allProducts]);

  if (isLoading || delayedLoading) return <RecommendedCardsSkeleton />;

  return (
    <section>
      <h2 className={css.title}>{title}</h2>
      <CustomSlider
        items={allProducts}
        itemsPerSlide={4}
        renderItem={(item) => (
          <div
            className={`${css.container} ${activeCardId === item.id ? css.active : ''}`}
            onClick={() => setActiveCardId(item.id)}
            onBlur={() => setActiveCardId(null)}
          >
            <CardCollection
              item={item}
              categoryId={item.id}
              from="recommended"
            />
          </div>
        )}
        prevBtnClassName={css.recommendedPrevBtn}
        nextBtnClassName={css.recommendedNextBtn}
        arrowIconClassName={css.recommendedArrowIcon}
      />
    </section>
  );
}
