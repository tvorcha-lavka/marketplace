import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HiArrowPath } from 'react-icons/hi2';
import { adverts } from '../../AdvertList/adverts';
import CardCollection from '../../CardCollection/CardCollection';
import Pagination from '../Pagination/Pagination';
import css from './ProductList.module.css';

const COUNT_PRODUCTS = 9;
export default function ProductList() {
  const [next, setNext] = useState(COUNT_PRODUCTS);
  const [activeCardId, setActiveCardId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = new URLSearchParams(location.search).get('page') || 1;

  const onPageChange = (newPage) => {
    navigate(`?page=${newPage}`);
  };

  const loadMore = () => {
    setNext(next + COUNT_PRODUCTS);
  };

  const handleCardBlur = () => {
    setActiveCardId(null);
  };

  return (
    <div>
      <ul className={css.list}>
        {adverts.map((item) => (
          <li
            className={`${css.item} ${activeCardId === item.id ? css.active : ''}`}
            // onClick={() => handleCardClick(item.id)}
            onBlur={handleCardBlur}
            key={item.id}
          >
            <CardCollection item={item} />
          </li>
        ))}
      </ul>
      {next < adverts.length && (
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
