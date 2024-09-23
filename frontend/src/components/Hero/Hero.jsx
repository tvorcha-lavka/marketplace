//import AddItemButton from '../../components/AddItemButton/AddItemButton';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>
        Tvorcha Lavka - зроблено з любов'ю, куплено з натхненням
      </h1>
      <p className={styles.caption}>
        Перший український маркетплейс handmade товарів
      </p>
      {/* <AddItemButton className={styles.button} /> */}
      <button className={styles.button}>Додати товар</button>
    </section>
  );
}

