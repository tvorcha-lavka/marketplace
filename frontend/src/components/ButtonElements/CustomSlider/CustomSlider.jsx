import { useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import css from './CustomSlider.module.css';

export default function CustomSlider({
  items = [],
  itemsPerSlide = 4,
  renderItem,
  prevBtnClassName = '',
  nextBtnClassName = '',
  arrowIconClassName = '',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);

  const maxIndex = items.length - itemsPerSlide;
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= maxIndex;

  const nextSlide = () => {
    if (!isAtEnd) {
      setCurrentIndex((prev) => Math.min(prev + itemsPerSlide, maxIndex));
    }
  };

  const prevSlide = () => {
    if (!isAtStart) {
      setCurrentIndex((prev) => Math.max(prev - itemsPerSlide, 0));
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisablePrev(currentIndex === 0);
      setDisableNext(currentIndex >= maxIndex);
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentIndex, maxIndex]);

  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerSlide);

  return (
    <div className={css.slider}>
      <button
        className={`${css.prevBtn} ${prevBtnClassName}`}
        onClick={prevSlide}
        disabled={disablePrev}
      >
        <IoIosArrowBack className={`${css.arrowIcon} ${arrowIconClassName}`} />
      </button>

      <ul className={css.cardList}>
        {visibleItems.map((item, idx) => (
          <li key={item.id || idx} className={css.cardItem}>
            {renderItem(item)}
          </li>
        ))}
      </ul>

      <button
        className={`${css.nextBtn} ${nextBtnClassName}`}
        onClick={nextSlide}
        disabled={disableNext}
      >
        <IoIosArrowForward
          className={`${css.arrowIcon} ${arrowIconClassName}`}
        />
      </button>
    </div>
  );
}
