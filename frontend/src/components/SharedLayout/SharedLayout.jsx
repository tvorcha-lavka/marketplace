import { Outlet, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Loader from '../../formModalComponents/Loader/Loader';

import {
  getAllCategoriesWithPopular} from '../../redux/categories/categoriesOperations';
import HeaderCart from '../HeaderCart/HeaderCart';

//import css from './SharedLayout.module.css';

export default function SharedLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategoriesWithPopular());
  }, [dispatch]);
  
  const location = useLocation();
  const isCartPage = location.pathname === '/cart';
  const isOrderPage = location.pathname === '/order';
  const isConfirmationPage = location.pathname === '/confirmation';

  return (
    <div>
      {isCartPage || isOrderPage || isConfirmationPage ? (
        <HeaderCart />
      ) : (
        <Header />
      )}
     <main className={css.layout}>
        <Suspense
          fallback={
            <div className={css.layoutLoader}>
              <Loader />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
