import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from '../src/pages/HomePage/HomePage';
import CartPage from '../src/pages/CartPage/CartPage';
import LoginPage from '../src/pages/LoginPage';
import RegisterPage from '../src/pages/RegisterPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
