import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from '../src/pages/HomePage/HomePage';
import CartPage from '../src/pages/CartPage/CartPage';
import SharedLayout from './components/SharedLayout/SharedLayout';
import ModalParentComponent from './components/ModalParentComponent/ModalParentComponent';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import SupportPage from './pages/SupportPage/SupportPage';

export default function App() {
  return (
    <>
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
