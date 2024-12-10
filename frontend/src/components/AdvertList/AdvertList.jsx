import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CardCollection from '../CardCollection/CardCollection';

import { getProducts } from '../../redux/products/operations';
import { selectProducts } from '../../redux/products/selectors';

import css from './AdvertList.module.css';

export default function AdvertList() {
  const [activeCardId, setActiveCardId] = useState(null);

  const dispatch = useDispatch();
  const allProducts = useSelector(selectProducts);

  useEffect(() => {
    dispatch(getProducts({ vip_status: true }));
  }, [dispatch]);

  const handleCardBlur = () => {
    setActiveCardId(null);
  };

  return (
    <section className={css.container}>
      <h2 className={css.title}>VIP оголошення</h2>
      <ul className={css.list}>
        {allProducts.map((item) => (
          <li
            className={`${css.item} ${activeCardId === item.id ? css.active : ''}`}
            onBlur={handleCardBlur}
            key={item.id}
          >
            <CardCollection item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
