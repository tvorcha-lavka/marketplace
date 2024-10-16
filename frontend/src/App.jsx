import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshUser, setAuthHeader } from './redux/auth/operations';
import {
  selectAccessToken,
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
  const accessToken = useSelector(selectAccessToken);
  const isRefresh = useSelector(selectRefreshing);

  useEffect(() => {
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
