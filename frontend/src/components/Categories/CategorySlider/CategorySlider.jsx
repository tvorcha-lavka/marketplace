import Slider from 'react-slick';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

import { media } from '../../../utils/mediaConfig';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import css from './CategorySlider.module.css';

function CustomPrevArrow(props) {
  const { className, style, onClick } = props;

  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        left: '8px',
        top: '60px',
        width: '24px',
        height: '24px',
        background: 'rgba(255, 255, 255, 0.8)',
        size: '24px',
        zIndex: 1,
      }}
      onClick={onClick}
    >
      <IoIosArrowBack size={20} className={css.arrowIcon} color="black" />
    </div>
  );
}

function CustomNextArrow(props) {
  const { style, onClick } = props;

  return (
    <button
      style={{
        ...style,
        zIndex: 1,
        display: 'block',
      }}
      className={css.nextBtn}
      onClick={onClick}
    >
      <IoIosArrowForward size={20} className={css.arrowIcon} />
    </button>
  );
}

export default function CategorySlider({ category }) {
  const categoryChildren = category.children || [];

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,

    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <ul className={css.sliderContainer}>
      {categoryChildren && categoryChildren.length > 4 ? (
        <Slider {...settings}>
          {categoryChildren.map((item, id) => (
            <li key={id} className={css.sliderItem}>
              <img
                src={
                  item.image ? item.image.url : `${media}/defaults/no-image.jpg`
                }
                alt={item.title}
                className={css.itemImg}
              />
              <p className={css.childTitle}>{item.title}</p>
            </li>
          ))}
        </Slider>
      ) : (
        <ul className={css.categoryList}>
          {categoryChildren?.map((item, id) => (
            <li key={id} className={css.sliderItem}>
              <img
                src={
                  item.image ? item.image.url : `${media}/defaults/no-image.jpg`
                }
                alt={item.title}
                className={css.itemImg}
              />
              <p className={css.childTitle}>{item.title}</p>
            </li>
          ))}
        </ul>
      )}
    </ul>
  );
}
