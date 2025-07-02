import RatingStars from '../RatingStars/RatingStars';
import CustomEditButton from '../../ButtonElements/CustomEditButton/CustomEditButton';

import { media } from '../../../utils/mediaConfig';
import { formatJoinDate, formatTime } from '../../../utils/formatDate';

import css from './Owner.module.css';

export default function Owner({ product }) {
  return (
    <>
      <img
        className={css.avatar}
        src={`${media}/defaults/no-image.jpg`}
        alt={product.owner.username}
      />

      <div>
        <div className={css.seller}>
          <p className={css.sellerName}>{product.owner.username}</p>

          <RatingStars rating={product.owner.rating} />

          <p className={css.startStore}>
            на Tvorcha Lavka з&nbsp;
            {formatJoinDate(product.owner.date_joined)}&nbsp;р.
          </p>
          <p className={css.sellerOnline}>
            Онлайн в&nbsp;{formatTime(product.owner.last_active)}
          </p>
        </div>

        <div className={css.startChat}>
          <CustomEditButton>Зв&#x2019;язатись з продавцем</CustomEditButton>
        </div>
      </div>
    </>
  );
}
