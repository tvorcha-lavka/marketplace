import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CardCollection from '../CardCollection/CardCollection';
import AdvertListSkeleton from './AdvertListSkeleton';

import { getProducts } from '../../redux/products/operations';
import { selectProducts, selectLoading } from '../../redux/products/selectors';
import useDelayedLoading from '../../hooks/useDelayedLoading';

import css from './AdvertList.module.css';

export default function AdvertList() {
  const [activeCardId, setActiveCardId] = useState(null);

  const dispatch = useDispatch();
  const allProducts = useSelector(selectProducts)?.results || [];

  const isLoading = useSelector(selectLoading);
  const delayedLoading = useDelayedLoading(isLoading);

  useEffect(() => {
    dispatch(getProducts({ is_vip: true }));
  }, [dispatch]);

  const handleCardBlur = () => {
    setActiveCardId(null);
  };

  const vipProducts = allProducts.filter((item) => item.is_vip);

  if (isLoading || delayedLoading) return <AdvertListSkeleton />;

  return (
    <section className="container">
      <div className={css.section}>
        <h2 className={css.title}>VIP оголошення</h2>
        <ul className={css.list}>
          {vipProducts.map((item) => (
            <li
              className={`${css.item} ${activeCardId === item.id ? css.active : ''}`}
              onBlur={handleCardBlur}
              key={item.id}
            >
              <CardCollection item={item} categoryId={item.id} from="main" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
