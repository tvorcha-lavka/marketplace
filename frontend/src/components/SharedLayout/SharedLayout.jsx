import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import css from './SharedLayout.module.css';

export default function SharedLayout() {
  const location = useLocation();
  const isUnderDevelopPage = location.pathname === '/under-development'
  return (
    <div className={isUnderDevelopPage ? `${css.page_container}` : ''}>
      <Header />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  );
}
