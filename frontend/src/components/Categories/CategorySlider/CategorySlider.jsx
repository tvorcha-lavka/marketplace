import CustomSlider from '../../ButtonElements/CustomSlider/CustomSlider';

import { media } from '../../../utils/mediaConfig';

import css from './CategorySlider.module.css';

export default function CategorySlider({ category }) {
  const categoryChildren = category?.children || [];

  if (!categoryChildren.length) return null;

  return categoryChildren.length > 4 ? (
    <CustomSlider
      items={categoryChildren}
      itemsPerSlide={4}
      renderItem={(item) => (
        <div className={css.sliderItem}>
          <img
            src={item.image ? item.image.url : `${media}/defaults/no-image.jpg`}
            alt={item.title}
            className={css.itemImg}
          />
          <p className={css.childTitle}>{item.title}</p>
        </div>
      )}
      prevBtnClassName={css.categoryPrevBtn}
      nextBtnClassName={css.categoryNextBtn}
      arrowIconClassName={css.categoryArrowIcon}
    />
  ) : (
    <ul className={css.categoryList}>
      {categoryChildren.map((item, id) => (
        <li key={id} className={css.sliderItem}>
          <img
            src={item.image ? item.image.url : `${media}/defaults/no-image.jpg`}
            alt={item.title}
            className={css.itemImg}
          />
          <p className={css.childTitle}>{item.title}</p>
        </li>
      ))}
    </ul>
  );
}
