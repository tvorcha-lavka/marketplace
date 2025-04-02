import { HiOutlinePencilAlt } from 'react-icons/hi';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

import RatingStars from '../RatingStars/RatingStars';

import { media } from '../../../utils/mediaConfig';

import css from './Owner.module.css';

export default function Owner({ product }) {
  const formatDateJoined = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'd MMMM yyyy', { locale: uk });
  };

  const formatLastActive = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'HH:mm', { locale: uk });
  };

  return (
    <>
      <div>
        <img
          className={css.avatar}
          src={`${media}/defaults/no-image.jpg`}
          alt={product.owner.username}
        />
      </div>

      <div>
        <div className={css.seller}>
          <p className={css.sellerName}>{product.owner.username}</p>

          <RatingStars rating={product.owner.rating} />

          <p className={css.startStore}>
            на Tvorcha Lavka з&nbsp;
            {formatDateJoined(product.owner.date_joined)}&nbsp;р.
          </p>
          <p className={css.sellerOnline}>
            Онлайн в&nbsp;{formatLastActive(product.owner.last_active)}
          </p>
        </div>

        <div className={css.startChat}>
          <button type="button" className={css.chatBtn}>
            Зв&#x2019;язатись з продавцем
          </button>
          <span className={css.pencilIcon}>
            <HiOutlinePencilAlt />
          </span>
        </div>
      </div>
    </>
  );
}
