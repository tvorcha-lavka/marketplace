import { Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshUser, setAuthHeader, logOut } from './redux/auth/operations';
import { useModal } from './hooks/useModal';
import {
  selectAccessToken,
  selectRefreshToken,
  selectRefreshing,
} from './redux/auth/selectors';
import HomePage from '../src/pages/HomePage/HomePage';
import CartPage from '../src/pages/CartPage/CartPage';
import SharedLayout from './components/SharedLayout/SharedLayout';
import ModalParentComponent from './components/ModalParentComponent/ModalParentComponent';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import SupportPage from './pages/SupportPage/SupportPage';
import LogoutButton from './components/LogoutButton/LogoutButton';
import Loader from './components/Loader/Loader';

export default function App() {
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);
  const isRefresh = useSelector(selectRefreshing);

  useEffect(() => {
    if (refreshToken) {
      const decodedRefresh = jwtDecode(refreshToken);
      console.log('decoded refresh token', decodedRefresh);
      if (decodedRefresh.exp && decodedRefresh.exp < moment().unix()) {
        console.log('Logging out due to expired refresh token');
        dispatch(logOut());
        openModal('login');
        return;
      }
    }

    if (accessToken) {
      setAuthHeader(accessToken);

      dispatch(refreshUser());
    }
  }, [dispatch]);

  return isRefresh ? (
    <Loader />
  ) : (
    <>
      <LogoutButton />
      <ModalParentComponent />
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
