import Header from '../../components/Header/Header.jsx';
import Navigation from '../../components/Navigation/Navigation.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Header />
      <Navigation />
      <Footer />
    </div>
  );
}
