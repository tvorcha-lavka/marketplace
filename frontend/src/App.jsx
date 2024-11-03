import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { validateTokensOnPageReload } from './redux/axiosConfig';
import { lazy } from 'react';
import SharedLayout from './components/SharedLayout/SharedLayout';
import ModalParentComponent from './formModalComponents/ModalParentComponent/ModalParentComponent';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import LogoutButton from './components/LogoutButton/LogoutButton';
import SocialAuthHandler from './formModalComponents/SocialAuthHandler/SocialAuthHandler';
import UnderDevelopPage from './pages/UnderDevelopPage/UnderDevelopPage';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const CartPage = lazy(() => import('./pages/CartPage/CartPage'));
const SupportPage = lazy(() => import('./pages/SupportPage/SupportPage'));

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
          <Route path="/support" element={<SupportPage />} />

          <Route
            path="/login/google/complete"
            element={<SocialAuthHandler provider="google" />}
          />
          <Route
            path="/login/facebook/complete"
            element={<SocialAuthHandler provider="facebook" />}
          />
           <Route path="/under-development" element={<UnderDevelopPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ModalParentComponent />
      <Toaster />
    </>
  );
}
