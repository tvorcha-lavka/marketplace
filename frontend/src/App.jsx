import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, lazy } from 'react';
import { validateTokensOnPageReload } from './redux/axiosConfig';

import { RestrictedRoute } from './components/RestrictedRoute/RestrictedRoute';
//import { PrivateRoute } from './components/PrivateRoute/PrivateRoute';
import SharedLayout from './components/SharedLayout/SharedLayout';
import ModalParentComponent from './formModalComponents/ModalParentComponent/ModalParentComponent';
import SocialAuthHandler from './formModalComponents/SocialAuthHandler/SocialAuthHandler';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const AllCategoriesPage = lazy(
  () => import('./pages/AllCategoriesPage/AllCategoriesPage')
);
const CategoryPage = lazy(() => import('./pages/CategoryPage/CategoryPage'));
const CartPage = lazy(() => import('./pages/CartPage/CartPage'));
const PlaceOrderPage = lazy(
  () => import('./pages/PlaceOrderPage/PlaceOrderPage')
);
const ConfirmationPage  = lazy(
  () => import('./pages/ConfirmationPage/ConfirmationPage')
);
const CardDetailsPage = lazy(
  () => import('./pages/CardDetailsPage/CardDetailsPage')
);
const SupportPage = lazy(() => import('./pages/SupportPage/SupportPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage'));

export default function App() {
  useEffect(() => {
    validateTokensOnPageReload();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/cart"
            element={
              <RestrictedRoute redirectTo="/" component={<CartPage />} />
            }
          />
          {/* <Route
            path="/cards"
            element={
              <RestrictedRoute redirectTo="/" component={<ProductListPage />} />
            }
          /> */}
          <Route
            path="/order"
            element={
              <RestrictedRoute redirectTo="/" component={<PlaceOrderPage />} />
            }
          />

          <Route
            path="/confirmation"
            element={
              <RestrictedRoute redirectTo="/" component={<ConfirmationPage />} />
            }
          />
          <Route
            path="/cards/:cardId"
            element={
              <RestrictedRoute redirectTo="/" component={<CardDetailsPage />} />
            }
          />
          <Route
            path="/categories"
            element={
              <RestrictedRoute
                redirectTo="/"
                component={<AllCategoriesPage />}
              />
            }
          />
          <Route
            path="/categories/:categoryId"
            element={
              <RestrictedRoute redirectTo="/" component={<CategoryPage />} />
            }
          />

          <Route path="/support" element={<SupportPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path="/login/google/complete"
            element={<SocialAuthHandler provider="google" />}
          />
          <Route
            path="/login/facebook/complete"
            element={<SocialAuthHandler provider="facebook" />}
          />
        </Route>
      </Routes>

      <ModalParentComponent />
      <Toaster />
    </>
  );
}
