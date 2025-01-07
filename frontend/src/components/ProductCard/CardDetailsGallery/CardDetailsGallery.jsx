import { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

import { media } from '../../../utils/mediaConfig';

import css from './CardDetailsGallery.module.css';

export default function CardDetailsGallery({ product }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = product.images || [];

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={css.gallery}>
      <ul className={css.galleryList}>
        {product.images.slice(0, 5).map((image, index) => (
          <li key={index}>
            <img
              className={css.galleryItem}
              src={image.s_image_url}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
            />
          </li>
        ))}
      </ul>

      <div className={css.swiperContainer}>
        <div className={css.swiper}>
          <button className={css.prevBtn} onClick={prevSlide}>
            <IoIosArrowBack className={css.arrowIcon} />
          </button>
          {images[currentIndex] ? (
            <img
              className={css.largeImage}
              src={images[currentIndex].l_image_url}
              alt={`Slide ${currentIndex + 1}`}
            />
          ) : (
            <img
              className={css.largeImage}
              src={`${media}/defaults/no-image.jpg`}
              alt="No image available"
            />
          )}
          <button className={css.nextBtn} onClick={nextSlide}>
            <IoIosArrowForward className={css.arrowIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}
