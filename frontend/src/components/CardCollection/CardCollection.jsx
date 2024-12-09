import { Link } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';

import { media } from '../../utils/mediaConfig';

import css from './CardCollection.module.css';

export default function CardCollection({ item }) {
  const { id, date_published, price, s_image_url, title } = item;
  const handleLikeButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      <button className={css.likeBtn} onClick={handleLikeButtonClick}>
        <FaRegHeart />
      </button>
      <Link to={`/cards/${id}`} className={css.link}>
        <div className={css.item}>
          <img
            className={css.image}
            src={s_image_url ? s_image_url : `${media}/page/404/not-found.png`}
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
