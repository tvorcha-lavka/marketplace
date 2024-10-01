import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getPopCategories } from '../../redux/categories/categoriesOperations';
import styles from './PopularCategories.module.css';
import popImg1 from '../../images/popImg1.png';
import popImg2 from '../../images/popImg2.png';
import popImg3 from '../../images/popImg3.png';
import popImg4 from '../../images/popImg4.png';
import popImg5 from '../../images/popImg5.png';
import { selectPopCategories } from '../../redux/categories/categoriesSelectors';

export default function PopularCategories() {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch();
  const popCategories = useSelector(selectPopCategories)

  console.log(popCategories)
   useEffect(() => {
    dispatch(getPopCategories());
   }, [dispatch]);
  
  return (
    <section className={styles.container}>
      <div className={styles.title_box}>
        <h2 className={styles.title}>Популярні категорії</h2>
        <button
          onClick={() => setIsOpen(true)} className={styles.btn}>Всі категорії</button>
      </div>
      <ul className={styles.list}>
        <li className={styles.item}>
          <h3 className={styles.item_title}>Дитячі іграшки на день Дитини</h3>
          <img src={popImg1} alt="" className={styles.img1} />
        </li>
        <li className={styles.item}>
          <h3 className={styles.item_title}>Декоративна кераміка</h3>
          <img src={popImg3} alt="" className={styles.img3} />
        </li>
        <li className={styles.item}>
          <h3 className={styles.item_title}>Декоративне освітлення</h3>
          <img src={popImg2} alt="" className={styles.img2} />
        </li>
        <li className={styles.item}>
          <h3 className={styles.item_title}>
            Декоративні <br /> свічки
          </h3>
          <img src={popImg4} alt="" className={styles.img4} />
        </li>
        <li className={styles.item}>
          <h3 className={styles.item_title}>
            Вишиванки на день Незалежності України
          </h3>
          <img src={popImg5} alt="" className={styles.img5} />
        </li>
      </ul>
    </section>
  );
}
