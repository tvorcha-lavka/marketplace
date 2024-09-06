import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import styles from './SharedLayout.module.css';

export default function SharedLayout() {
  return (
    <div className={styles.container}>
      <Header />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  );
}
