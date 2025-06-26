import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, lazy } from 'react';
import { validateTokensOnPageReload } from './redux/axiosConfig';

//import RestrictedRoute from './components/RestrictedRoute/RestrictedRoute';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import SharedLayout from './components/SharedLayout/SharedLayout';
import ModalParentComponent from './authModalComponents/ModalParentComponent/ModalParentComponent';
import SocialAuthHandler from './authModalComponents/SocialAuthHandler/SocialAuthHandler';
import SessionExpiredModal from './authModalComponents/SessionExpiredModal/SessionExpiredModal';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const AllCategoriesPage = lazy(
  () => import('./pages/AllCategoriesPage/AllCategoriesPage')
);
const CategoryPage = lazy(() => import('./pages/CategoryPage/CategoryPage'));
const CardDetailsPage = lazy(
  () => import('./pages/CardDetailsPage/CardDetailsPage')
);

const AddAdvertisementPage = lazy(
  () => import('./pages/AddAdvertisementPage/AddAdvertisementPage')
);
const CartPage = lazy(() => import('./pages/CartPage/CartPage'));
const PlaceOrderPage = lazy(
  () => import('./pages/PlaceOrderPage/PlaceOrderPage')
);
const ConfirmationPage = lazy(
  () => import('./pages/ConfirmationPage/ConfirmationPage')
);

/*HEADER PAGES*/
const UserPrivateChatPage = lazy(
  () => import('./pages/UserPrivateChatPage/UserPrivateChatPage')
);
const UserPrivateNoticePage = lazy(
  () => import('./pages/UserPrivateNoticePage/UserPrivateNoticePage')
);
const LikeCartPage = lazy(() => import('./pages/LikeCartPage/LikeCartPage'));
const EmptySearchFieldPage = lazy(
  () => import('./pages/EmptySearchFieldPage/EmptySearchFieldPage')
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

const SupportPage = lazy(() => import('./pages/SupportPage/SupportPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage'));
const ComingSoonPage = lazy(
  () => import('./pages/ComingSoonPage/ComingSoonPage')
);

/*USER PROFILE SETTING PAGES*/
const ProfileSettingsPage = lazy(
  () => import('./pages/ProfileSettingsPage/ProfileSettingsPage')
);
const UserInformationPage = lazy(
  () => import('./pages/UserInformationPage/UserInformationPage')
);
const UserProfilePaymentsPage = lazy(
  () => import('./pages/UserProfilePaymentsPage/UserProfilePaymentsPage')
);
const UserProfileDeliveryPage = lazy(
  () => import('./pages/UserProfileDeliveryPage/UserProfileDeliveryPage')
);
const UserProfileNotificationPage = lazy(
  () =>
    import('./pages/UserProfileNotificationPage/UserProfileNotificationPage')
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
          <Route path="/like-cart" element={<LikeCartPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/categories" element={<AllCategoriesPage />} />
          <Route path="/categories/:categoryId" element={<CategoryPage />} />
          <Route path="/:cardId" element={<CardDetailsPage />} />

          {/* USER PRIVATE ROUTE */}
          <Route
            path="/my-chat"
            element={
              <PrivateRoute
                redirectTo="/"
                component={<UserPrivateChatPage />}
              />
            }
          />
          <Route
            path="/my-notice"
            element={
              <PrivateRoute
                redirectTo="/"
                component={<UserPrivateNoticePage />}
              />
            }
          />
          <Route
            path="/order"
            element={
              <PrivateRoute redirectTo="/" component={<PlaceOrderPage />} />
            }
          />
          <Route
            path="/confirmation/order"
            element={
              <PrivateRoute
                redirectTo="/"
                component={<ConfirmationPage type="order" />}
              />
            }
          />
          <Route
            path="/confirmation/ad"
            element={
              <PrivateRoute
                redirectTo="/"
                component={<ConfirmationPage type="ad" />}
              />
            }
          />
          <Route
            path="/advertisement"
            element={
              <PrivateRoute
                redirectTo="/"
                component={<AddAdvertisementPage />}
              />
            }
          />
          <Route
            path="/profile-settings"
            element={
              <PrivateRoute
                redirectTo="/"
                component={<ProfileSettingsPage />}
              />
            }
          >
            <Route index element={<Navigate to="profile-info" replace />} />
            <Route path="profile-info" element={<UserInformationPage />} />
            <Route
              path="profile-payment"
              element={<UserProfilePaymentsPage />}
            />
            <Route
              path="profile-delivery"
              element={<UserProfileDeliveryPage />}
            />
            <Route
              path="profile-notice"
              element={<UserProfileNotificationPage />}
            />
          </Route>
        </Route>
      </Routes>

      <ModalParentComponent />
      <SessionExpiredModal />
      <Toaster />
    </>
  );
}
