import { useState } from 'react';

import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

import CardCollection from '../CardCollection/CardCollection';

import { adverts } from '../AdvertList/adverts';

import css from './RecommendedCards.module.css';

export default function RecommendedCards() {
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

  const cards = adverts
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
          {cards.map((item) => (
            <li
              className={`${css.container} ${
                activeCardId === item.id ? css.active : ''
              }`}
              onClick={() => handleCardClick(item.id)}
              onBlur={handleCardBlur}
              key={item.id}
            >
              <CardCollection item={item} />
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
