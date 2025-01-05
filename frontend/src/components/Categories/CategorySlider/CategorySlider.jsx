import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector } from 'react-redux';
import { RiArrowRightSLine } from 'react-icons/ri';
import { selectCategoryById } from '../../../redux/categories/categoriesSelectors';
import { media } from '../../../utils/mediaConfig';
// import photoAlternate from '../../../images/not-found.png';

import css from './CategorySlider.module.css';

function CustomPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        left: '18px',
        top: '60px',
        zIndex: 1,
        display: 'block',
        size: '24px',
      }}
      onClick={onClick}
    ></div>
  );
}

function CustomNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        right: '26px',
        top: '60px',
        fontSize: '24px',
        zIndex: 1,
        display: 'block',
        // background: 'rgda(f, f, f, 0.8)',
      }}
      onClick={onClick}
    ></div>
  );
}

export default function CategorySlider({ category }) {
  const categoryChildren = category.children || [];
  // console.log('category:', category);
  // console.log('categoryChildren:', categoryChildren);

  const settings = {
    dots: false,
    className: 'center',
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 4,
    swipeToSlide: true,
    afterChange: function (index) {
      console.log(
        `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
      );
    },

    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <ul className={css.slider_container}>
      {categoryChildren && categoryChildren.length > 4 ? (
        <Slider {...settings}>
          {categoryChildren.map((item, id) => (
            <li key={id} className={css.slider_item}>
              <img
                src={`${media}/page/404/not-found.png`}
                alt={item.title}
                className={css.item_img}
              />
              <p className={css.child_title}>{item.title}</p>
            </li>
          ))}
        </Slider>
      ) : (
        <ul className={css.category_list}>
          {categoryChildren?.map((item, id) => (
            <li key={id} className={css.slider_item}>
              <img
                src={
                  item.image
                    ? item.image.url
                    : `${media}/page/404/not-found.png`
                }
                alt={item.title}
                className={css.item_img}
              />
              <p className={css.child_title}>{item.title}</p>
            </li>
          ))}
        </ul>
      )}
    </ul>
  );
}
