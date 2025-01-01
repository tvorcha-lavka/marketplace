import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { HiArrowPath } from 'react-icons/hi2';

import CardCollection from '../../CardCollection/CardCollection';
import Pagination from '../Pagination/Pagination';

import { getProducts } from '../../../redux/products/operations';
import { selectProducts } from '../../../redux/products/selectors';

import css from './ProductList.module.css';

const COUNT_PRODUCTS = 9;

export default function ProductList({ categoryId }) {
  const [next, setNext] = useState(COUNT_PRODUCTS);
  const [activeCardId, setActiveCardId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allProducts = useSelector(selectProducts);

  const currentPage = new URLSearchParams(location.search).get('page') || 1;

  useEffect(() => {
    dispatch(getProducts({ page: currentPage, category: categoryId }));
  }, [dispatch, currentPage, categoryId]);

  const onPageChange = (newPage) => {
    navigate(`?category=${categoryId || ''}&page=${newPage}`);
  };

  const loadMore = () => {
    setNext(next + COUNT_PRODUCTS);
  };

  const handleCardBlur = () => {
    setActiveCardId(null);
  };

  return (
    <div>
      {allProducts.length > 0 && (
        <ul className={css.list}>
          {allProducts.map((item) => (
            <li
              className={`${css.item} ${activeCardId === item.id ? css.active : ''}`}
              onBlur={handleCardBlur}
              key={item.id}
            >
              <CardCollection
                item={item}
                from="categories"
                categoryId={categoryId}
              />
            </li>
          ))}
        </ul>
      )}

      {next < allProducts.length && (
        <button className={css.btn_more} onClick={loadMore}>
          <p>Завантажити ще</p>
          <HiArrowPath size={24} className={css.btn_icon} />
        </button>
      )}
      <Pagination
        onPageChange={onPageChange}
        currentPage={parseInt(currentPage)}
      />
    </div>
  );
}
