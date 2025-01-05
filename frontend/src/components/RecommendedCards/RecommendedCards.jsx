import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

import CardCollection from '../CardCollection/CardCollection';

import { getProducts } from '../../redux/products/operations';
import { selectProducts } from '../../redux/products/selectors';

import css from './RecommendedCards.module.css';

export default function RecommendedCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCardId, setActiveCardId] = useState(null);

  const itemsPerSlide = 4;

  const dispatch = useDispatch();
  const allProducts = useSelector(selectProducts);
  console.log(allProducts)

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, allProducts]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allProducts.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + allProducts.length) % allProducts.length
    );
  };

  const cards = allProducts
    .slice(currentIndex, currentIndex + itemsPerSlide)
    .concat(
      allProducts.slice(
        0,
        Math.max(0, currentIndex + itemsPerSlide - allProducts.length)
      )
    );

  const handleCardClick = (id) => {
    setActiveCardId(id);
  };

  const handleCardBlur = () => {
    setActiveCardId(null);
  };

  return (
    <>
      <div>
        <h2 className={css.title}>Вам також може сподобатись:</h2>
        <div className={css.slider}>
          <button className={css.prevBtn} onClick={prevSlide}>
            <IoIosArrowBack className={css.arrowIcon} />
          </button>

          <ul className={css.card}>
            {cards.map((item) => (
              <li
                className={`${css.container} ${
                  activeCardId === item.id ? css.active : ''
                }`}
                onClick={() => handleCardClick(item.id)}
                onBlur={handleCardBlur}
                key={item.id}
              >
                <CardCollection
                  item={item}
                  categoryId={item.categoryId}
                  from="recommended"
                />
              </li>
            ))}
          </ul>

          <button className={css.nextBtn} onClick={nextSlide}>
            <IoIosArrowForward className={css.arrowIcon} />
          </button>
        </div>
      </div>
    </>
  );
}
