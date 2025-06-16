import { useParams } from 'react-router-dom';

import ProductList from '../../components/Categories/ProductList/ProductList';

export default function ProductListPage() {
  const { categoryId } = useParams();
  return <ProductList categoryId={categoryId} />;
}
