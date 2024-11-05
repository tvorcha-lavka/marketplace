import { useState } from 'react';

import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

import VipCartsList from '../VipCartsList/VipCartsList';

import { adverts } from '../AdvertList/adverts';

import css from './RecommendedCarts.module.css';

export default function RecommendedCarts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCardId, setActiveCardId] = useState(null);

  const itemsPerSlide = 4;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % adverts.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + adverts.length) % adverts.length
    );
  };

  const visibleCards = adverts
    .slice(currentIndex, currentIndex + itemsPerSlide)
    .concat(
      adverts.slice(
        0,
        Math.max(0, currentIndex + itemsPerSlide - adverts.length)
      )
    );

  const handleCardClick = (id) => {
    setActiveCardId(id);
  };

  const handleCardBlur = () => {
    setActiveCardId(null);
  };

  return (
    <section className={css.section}>
      <h2 className={css.title}>Вам також може сподобатись:</h2>
      <div className={css.slider}>
        <button className={css.prevBtn} onClick={prevSlide}>
          <IoIosArrowBack className={css.arrowIcon} />
        </button>

        <ul className={css.card}>
          {visibleCards.map((item) => (
            <li
              className={`${css.container} ${
                activeCardId === item.id ? css.active : ''
              }`}
              onClick={() => handleCardClick(item.id)}
              onBlur={handleCardBlur}
              key={item.id}
            >
              <VipCartsList item={item} />
            </li>
          ))}
        </ul>

        <button className={css.nextBtn} onClick={nextSlide}>
          <IoIosArrowForward className={css.arrowIcon} />
        </button>
      </div>
    </section>
  );
}
