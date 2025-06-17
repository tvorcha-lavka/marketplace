import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';

import { media } from '../../utils/mediaConfig';

import css from './CardCollection.module.css';

export default function CardCollection({ item, categoryId, from }) {
  const [likedItems, setLikedItems] = useState([]);

  const { id, date_published, price, image, title } = item;

  const location = useLocation();

  const handleLikeButtonClick = (e) => {
    e.stopPropagation();
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const isLiked = likedItems.includes(id);

  return (
    <div>
      <button
        className={`${css.likeBtn} ${isLiked ? css.liked : ''}`}
        onClick={handleLikeButtonClick}
      >
        <FaRegHeart />
      </button>
      <Link
        to={`/${id}`}
        state={{ from, prevFrom: location.state?.from || null, categoryId }}
        className={css.link}
      >
        <div className={css.item}>
          <img
            className={css.image}
            src={image ? image : `${media}/defaults/no-image.jpg`}
            alt={title}
          />
        </div>
        <p className={css.publicDate}>Опубліковано&nbsp;{date_published}</p>
        <h1 className={css.cartTitle}>{title}</h1>
        <p className={css.price}>{price}&nbsp;грн</p>
      </Link>
    </div>
  );
}
