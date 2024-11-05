import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { HiArrowPath } from 'react-icons/hi2';
// import { PiArrowsCounterClockwiseBold , PiArrowsCounterClockwiseFill, PiArrowsCounterClockwise} from 'react-icons/pi';
import { adverts } from '../../AdvertList/adverts';
import Pagination from '../Pagination/Pagination';
import photoAlternate from '../../../images/not-found.png';
import css from './ProductList.module.css';

const COUNT_PRODUCTS = 9;
export default function ProductList() {
  const [next, setNext] = useState(COUNT_PRODUCTS);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = new URLSearchParams(location.search).get('page') || 1;

  const onPageChange = (newPage) => {
    navigate(`?page=${newPage}`);
  };

  const loadMore = () => {
    setNext(next + COUNT_PRODUCTS);
  };

  return (
    <div>
      <ul className={css.list}>
        {adverts?.length > 0 &&
          adverts?.slice(0, next)?.map((item, index) => (
            <li className={css.item} key={index}>
              <p className={css.category}>VIP-оголошення</p>
              <img
                className={css.img}
                src={item.img ? item.img : photoAlternate}
                alt=""
              />
              <button className={css.heart_btn} type="button">
                <FaRegHeart color="#000" className={css.icon} />
              </button>
              <div className={css.box_text}>
                <p className={css.span}>
                  <span>Опубліковано: 12.07.2024</span>
                </p>
                <p className={css.text}>
                  Українська традиційна вишиванка жіночка Львівська
                </p>
                <p className={css.price}>850 грн</p>
              </div>
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
