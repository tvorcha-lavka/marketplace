import { Routes, Route } from 'react-router-dom';
import HomePage from '../src/pages/HomePage/HomePage';
import CartPage from '../src/pages/CartPage/CartPage';
import SharedLayout from './components/SharedLayout/SharedLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Route>
    </Routes>
  );
}

