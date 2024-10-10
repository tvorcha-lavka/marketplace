import { FaRegHeart } from 'react-icons/fa';
import styles from './AdvertList.module.css';
import { adverts } from './adverts.js';
import photoAlternate from '../../images/not-found.png';

export default function AdvertList() {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>VIP оголошення</h2>
      <ul className={styles.list}>
        {adverts?.map((item, index) => (
          <li className={styles.item} key={index}>
            <p className={styles.category}>VIP-оголошення</p>
            <img
              className={styles.img}
              src={item.img ? item.img : photoAlternate}
              alt=""
            />
            <button className={styles.heart_btn} type="button">
              <FaRegHeart color="#000" className={styles.icon}/>
             
            </button>
            <div className={styles.box_text}>
              <p className={styles.span}>
                <span>Опубліковано: 12.07.2024</span>
              </p>
              <p className={styles.text}>
                Українська традиційна вишиванка жіночка Львівська
              </p>
              <p className={styles.span}>
                <span>Lara_Sylwer25</span>
              </p>
              <p className={styles.price}>850 грн</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
