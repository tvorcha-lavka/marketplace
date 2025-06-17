import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, lazy } from 'react';
import { validateTokensOnPageReload } from './redux/axiosConfig';

import { RestrictedRoute } from './components/RestrictedRoute/RestrictedRoute';
//import { PrivateRoute } from './components/PrivateRoute/PrivateRoute';
import SharedLayout from './components/SharedLayout/SharedLayout';
import ModalParentComponent from './formModalComponents/ModalParentComponent/ModalParentComponent';
import SocialAuthHandler from './formModalComponents/SocialAuthHandler/SocialAuthHandler';
import SessionExpiredModal from './formModalComponents/SessionExpiredModal/SessionExpiredModal';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const AllCategoriesPage = lazy(
  () => import('./pages/AllCategoriesPage/AllCategoriesPage')
);
const CategoryPage = lazy(() => import('./pages/CategoryPage/CategoryPage'));
const CartPage = lazy(() => import('./pages/CartPage/CartPage'));
const PlaceOrderPage = lazy(
  () => import('./pages/PlaceOrderPage/PlaceOrderPage')
);
const ConfirmationPage = lazy(
  () => import('./pages/ConfirmationPage/ConfirmationPage')
);
const CardDetailsPage = lazy(
  () => import('./pages/CardDetailsPage/CardDetailsPage')
);
const EmptySearchFieldPage = lazy(
  () => import('./pages/EmptySearchFieldPage/EmptySearchFieldPage')
);
const AddAdvertisementPage = lazy(
  () => import('./pages/AddAdvertisementPage/AddAdvertisementPage')
);
const SupportPage = lazy(() => import('./pages/SupportPage/SupportPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage'));
const ComingSoonPage = lazy(
  () => import('./pages/ComingSoonPage/ComingSoonPage')
);
const DiscountHeaderPage = lazy(
  () => import('./pages/DiscountHeaderPage/DiscountHeaderPage')
);
const LoveDayHeaderPage = lazy(
  () => import('./pages/LoveDayHeaderPage/LoveDayHeaderPage')
);
const PaymentDeliveryHeaderPage = lazy(
  () => import('./pages/PaymentDeliveryHeaderPage/PaymentDeliveryHeaderPage')
);

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

          <Route
            path="/order"
            element={
              <RestrictedRoute redirectTo="/" component={<PlaceOrderPage />} />
            }
          />

          <Route
            path="/confirmation/order"
            element={
              <RestrictedRoute
                redirectTo="/"
                component={<ConfirmationPage type="order" />}
              />
            }
          />

          <Route
            path="/confirmation/ad"
            element={
              <RestrictedRoute
                redirectTo="/"
                component={<ConfirmationPage type="ad" />}
              />
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

          <Route
            path="/:cardId"
            element={
              <RestrictedRoute redirectTo="/" component={<CardDetailsPage />} />
            }
          />

          <Route
            path="/advertisement"
            element={
              <RestrictedRoute
                redirectTo="/"
                component={<AddAdvertisementPage />}
              />
            }
          />

          <Route path="/support" element={<SupportPage />} />
          <Route path="/empty-search" element={<EmptySearchFieldPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/discount" element={<DiscountHeaderPage />} />
          <Route path="/love_day" element={<LoveDayHeaderPage />} />
          <Route
            path="/payment-delivery"
            element={<PaymentDeliveryHeaderPage />}
          />
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
      <SessionExpiredModal />
      <Toaster />
    </>
  );
}
