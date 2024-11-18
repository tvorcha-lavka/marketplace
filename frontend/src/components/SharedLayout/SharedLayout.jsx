import { Outlet, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import { getAllCategories } from '../../redux/categories/categoriesOperations';
import HeaderCart from '../HeaderCart/HeaderCart';

//import css from './SharedLayout.module.css';

export default function SharedLayout() {
  const location = useLocation();
  const dispatch = useDispatch();

  const isCartPage = location.pathname === '/cart';

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div>
      {isCartPage ? <HeaderCart /> : <Header />}
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  );
}
