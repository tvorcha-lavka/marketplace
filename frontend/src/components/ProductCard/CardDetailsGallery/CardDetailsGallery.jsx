import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import clsx from 'clsx';

import { media } from '../../../utils/mediaConfig';

import css from './CardDetailsGallery.module.css';

export default function CardDetailsGallery({ product }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = product.images || [];
  const smallImages = images.filter((image) => image.s_image_url);
  const hasMultipleImages = images.length > 1;
  const hasSmallImages = smallImages.length > 0;

  const prevSlide = () => {
    if (hasMultipleImages) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  const nextSlide = () => {
    if (hasMultipleImages) {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <div className={css.gallery}>
      {hasSmallImages && (
        <ul className={css.galleryList}>
          {smallImages.slice(0, 5).map((image, index) => (
            <li key={index}>
              <img
                className={clsx(
                  css.galleryItem,
                  currentIndex === index && css.galleryItemActive
                )}
                src={image.s_image_url}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setCurrentIndex(index)}
              />
            </li>
          ))}
        </ul>
      )}

      <div
        className={clsx(
          css.swiperContainer,
          hasSmallImages ? css.swiperSmall : css.swiperLarge
        )}
      >
        <div className={css.swiper}>
          <button
            className={clsx(css.prevBtn, !hasMultipleImages && css.disabledBtn)}
            onClick={prevSlide}
            disabled={!hasMultipleImages}
          >
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
          <button
            className={clsx(css.nextBtn, !hasMultipleImages && css.disabledBtn)}
            onClick={nextSlide}
            disabled={!hasMultipleImages}
          >
            <IoIosArrowForward className={css.arrowIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}
