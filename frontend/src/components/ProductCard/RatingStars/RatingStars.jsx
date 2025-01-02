import { FaStar } from 'react-icons/fa';

import css from './RatingStars.module.css';

export default function RatingStars({ rating }) {
  const totalStars = 5;
  const filledStars = Math.round(rating);

  return (
    <div className={css.reviewsBox}>
      <ul className={css.starsList}>
        {[...Array(totalStars)].map((_, index) => (
          <li key={index} className={css.star}>
            {index < filledStars ? (
              <FaStar className={css.active} /> 
            ) : (
              <FaStar className={css.inactive} /> 
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
