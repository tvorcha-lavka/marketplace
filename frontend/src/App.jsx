import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, lazy } from 'react';
import { validateTokensOnPageReload } from './redux/axiosConfig';

import SharedLayout from './components/SharedLayout/SharedLayout';
import ModalParentComponent from './formModalComponents/ModalParentComponent/ModalParentComponent';
import LogoutButton from './components/LogoutButton/LogoutButton';
import SocialAuthHandler from './formModalComponents/SocialAuthHandler/SocialAuthHandler';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const AllCategoriesPage = lazy(
  () => import('./pages/AllCategoriesPage/AllCategoriesPage')
);
const CartPage = lazy(() => import('./pages/CartPage/CartPage'));
const CartDetailsPage = lazy(
  () => import('./pages/CartDetailsPage/CartDetailsPage')
);
const SupportPage = lazy(() => import('./pages/SupportPage/SupportPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage'));

export default function App() {
  useEffect(() => {
    validateTokensOnPageReload();
  }, []);

  return (
    <>
      <LogoutButton />

      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/cart/:cartId" element={<CartDetailsPage />} />

          <Route path="/categories" element={<AllCategoriesPage />} />
          <Route path="/support" element={<SupportPage />} />

          <Route
            path="/login/google/complete"
            element={<SocialAuthHandler provider="google" />}
          />
          <Route
            path="/login/facebook/complete"
            element={<SocialAuthHandler provider="facebook" />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ModalParentComponent />
      <Toaster />
    </>
  );
}
