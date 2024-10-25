import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { validateTokensOnPageReload } from './redux/axiosConfig';
import HomePage from '../src/pages/HomePage/HomePage';
import CartPage from '../src/pages/CartPage/CartPage';
import SharedLayout from './components/SharedLayout/SharedLayout';
import ModalParentComponent from './formModalComponents/ModalParentComponent/ModalParentComponent';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import SupportPage from './pages/SupportPage/SupportPage';
import LogoutButton from './components/LogoutButton/LogoutButton';
import SocialAuthHandler from './formModalComponents/SocialAuthHandler/SocialAuthHandler';

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

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ModalParentComponent />
      <Toaster />
    </>
  );
}
