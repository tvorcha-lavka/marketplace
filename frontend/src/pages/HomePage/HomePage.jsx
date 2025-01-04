import PopularCategories from '../../components/PopularCategories/PopularCategories';
import AdvertList from '../../components/AdvertList/AdvertList';
import Question from '../../components/Question/Question';

export default function HomePage() {
  return (
    <div>
      <PopularCategories />
      <AdvertList />
      <Question />
    </div>
  );
}
