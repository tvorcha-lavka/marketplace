
import Hero from '../../components/Hero';
import PopularCategories from '../../components/PopularCategories/PopularCategories';
import AdvertList from '../../components/AdvertList/AdvertList';
import Question from '../../components/Question/Question';
// import styles from './styles.module.css';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularCategories />
      <AdvertList />
      <Question />
    </>
  );
}
