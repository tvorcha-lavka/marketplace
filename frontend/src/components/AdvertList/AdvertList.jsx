import { useState } from 'react';

import VipCartsList from '../VipCartsList/VipCartsList';

import { adverts } from './adverts';

import css from './AdvertList.module.css';

export default function AdvertList() {
  const [activeCardId, setActiveCardId] = useState(null);

  const handleCardBlur = () => {
    setActiveCardId(null);
  };

  return (
    <section className={css.container}>
      <h2 className={css.title}>VIP оголошення</h2>
      <ul className={css.list}>
        {adverts.map((item) => (
          <li
            className={`${css.item} ${activeCardId === item.id ? css.active : ''}`}
            // onClick={() => handleCardClick(item.id)}
            onBlur={handleCardBlur}
            key={item.id}
          >
            <VipCartsList item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
