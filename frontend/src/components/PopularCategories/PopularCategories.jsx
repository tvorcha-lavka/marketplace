import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPopCategories } from '../../redux/categories/categoriesOperations';
import { selectPopCategories } from '../../redux/categories/categoriesSelectors';
import styles from './PopularCategories.module.css';
import popImg1 from '../../images/popImg1.png';
import popImg3 from '../../images/popImg3.png';

export default function PopularCategories() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const popCategories = useSelector(selectPopCategories);

  const fivePopCategories = popCategories.slice(0, 5)
 
  useEffect(() => {
    dispatch(getPopCategories());
  }, [dispatch]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEFGHIJKLMNOP';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
 
  return (
    <section className={styles.container}>
      {isOpen !== true ? (
        <>
          <div className={styles.title_box}>
            <h2 className={styles.title}>Популярні категорії</h2>
            <button onClick={() => setIsOpen(true)} className={styles.btn}>
              Всі категорії
            </button>
          </div>

          <ul className={styles.list}>
            {fivePopCategories?.map(({ title, image }, index) => (
              <li
                key={index}
                className={styles.item}
                style={{
                  backgroundColor: getRandomColor(),
                }}
              >
                <h3 className={styles.item_title}>{title}</h3>
                <img src={popImg3} alt="" className={styles.img1} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={styles.box}>
          <h2 className={styles.title}> Всі категорії</h2>
          <ul className={styles.list}>
            {popCategories?.map(({ title, image }, index) => (
              <Link
                key={index}
                className={styles.item}
                style={{
                  backgroundColor: getRandomColor(),
                }}
              >
                <h3 className={styles.item_title}>{title}</h3>
                <img src={popImg1} alt="" className={styles.img1} />
              </Link>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
