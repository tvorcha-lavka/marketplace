import { FaRegHeart } from 'react-icons/fa';
import { adverts } from './adverts.js';
import photoAlternate from '../../images/not-found.png';
import css from './AdvertList.module.css';

export default function AdvertList() {
  return (
    <section className={css.container}>
      <h2 className={css.title}>VIP оголошення</h2>
      <ul className={css.list}>
        {adverts?.map((item, index) => (
          <li className={css.item} key={index}>
            <p className={css.category}>VIP-оголошення</p>
            <img
              className={css.img}
              src={item.img ? item.img : photoAlternate}
              alt=""
            />
            <button className={css.heart_btn} type="button">
              <FaRegHeart color="#000" className={css.icon}/>
             
            </button>
            <div className={css.box_text}>
              <p className={css.span}>
                <span>Опубліковано: 12.07.2024</span>
              </p>
              <p className={css.text}>
                Українська традиційна вишиванка жіночка Львівська
              </p>
              <p className={css.span}>
                <span>Lara_Sylwer25</span>
              </p>
              <p className={css.price}>850 грн</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
