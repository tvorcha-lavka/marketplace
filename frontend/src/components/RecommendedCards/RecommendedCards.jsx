import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CardCollection from '../CardCollection/CardCollection';
import CustomSlider from '../ButtonElements/CustomSlider/CustomSlider';

import { getProducts } from '../../redux/products/operations';
import { selectProducts } from '../../redux/products/selectors';

import css from './RecommendedCards.module.css';

export default function RecommendedCards({
  title = 'Вам також може сподобатись:',
}) {
  const dispatch = useDispatch();
  const [activeCardId, setActiveCardId] = useState(null);

  const productsData = useSelector(selectProducts);
  const allProducts = useMemo(
    () => productsData?.results || [],
    [productsData?.results]
  );

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, allProducts]);

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
