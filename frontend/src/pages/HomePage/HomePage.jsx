import PopularCategories from '../../components/PopularCategories/PopularCategories';
import AdvertList from '../../components/AdvertList/AdvertList';
import Question from '../../components/Question/Question';
import styles from './HomePage.module.css';


export default function HomePage() {
  return (
    <div className={styles.page}>
      <PopularCategories />
      <AdvertList />
      <Question />
    </div>
  );
}
