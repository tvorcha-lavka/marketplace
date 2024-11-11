import { Link } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';

import { media } from '../../utils/mediaConfig';

import css from './VipCartsList.module.css';

export default function VipCartsList({ item }) {
  const handleLikeButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      <button className={css.likeBtn} onClick={handleLikeButtonClick}>
        <FaRegHeart />
      </button>
      <Link to={`/cart/${item.id}`} className={css.link}>
        <div className={css.item}>
          <img
            className={css.image}
            src={item.img ? item.img : `${media}/page/404/not-found.png`}
            alt={item.title}
          />
          {/* <h3 className={css.titleVip}>VIP-ОГОЛОШЕННЯ</h3> */}
        </div>
        <p className={css.publicDate}>{item.date}</p>
        <h1 className={css.cartTitle}>{item.title}</h1>
        <p className={css.price}>{item.price}</p>
      </Link>
    </div>
  );
}
