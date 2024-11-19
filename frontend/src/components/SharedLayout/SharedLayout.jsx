import { Outlet } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Loader from '../../formModalComponents/Loader/Loader';

import { getAllCategories } from '../../redux/categories/categoriesOperations';

import css from './SharedLayout.module.css';

export default function SharedLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div>
      <Header />
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
