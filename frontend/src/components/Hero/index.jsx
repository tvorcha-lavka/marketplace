import styles from './styles.module.css';

export default function Hero() {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>
        Tvorcha Lavka - зроблено з любов'ю, куплено з натхненням
      </h1>
      <p className={styles.caption}>
        Перший український маркетплейс handmade товарів
      </p>
      <button className={styles.button}>Додати товар</button>
    </section>
  );
}
