import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa6';

import { media } from '../../utils/mediaConfig';

import css from './CardCollection.module.css';

export default function CardCollection({ item, categoryId, from }) {
  const [likedItems, setLikedItems] = useState([]);
  const [isMultiline, setIsMultiline] = useState(false);

  const { id, date_published, price, image, title } = item;

  const titleRef = useRef(null);
  const location = useLocation();
  const isLiked = likedItems.includes(id);

  useEffect(() => {
    const checkLines = () => {
      if (titleRef.current) {
        const el = titleRef.current;
        const computedStyle = getComputedStyle(el);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const height = el.offsetHeight;

        const lines = Math.round(height / lineHeight);
        setIsMultiline(lines > 1);
      }
    };

    requestAnimationFrame(() => {
      setTimeout(checkLines, 0);
    });
  }, [title]);

  const handleLikeButtonClick = (e) => {
    e.stopPropagation();
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <button className={css.likeBtn} onClick={handleLikeButtonClick}>
        {isLiked ? (
          <FaHeart className={`${css.likeIcon} ${isLiked ? css.liked : ''}`} />
        ) : (
          <FaRegHeart className={css.likeIcon} />
        )}
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

        <h2
          ref={titleRef}
          className={`${css.cartTitle} ${
            isMultiline ? css.cartTitleLong : css.cartTitleShort
          }`}
        >
          {title}
        </h2>
        <p className={css.price}>{price}&nbsp;грн</p>
      </Link>
    </div>
  );
}
