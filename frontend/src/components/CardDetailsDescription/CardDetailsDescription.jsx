import { useState, useRef } from 'react';

import CustomButton from '../CustomButton/CustomButton';

import css from './CardDetailsDescription.module.css';

export default function CardDetailsDescription({ product }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef(null);
  const maxDescriptionLength = 430;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const trimmedDescription = !isExpanded
    ? product.description.slice(0, maxDescriptionLength) +
      (product.description.length > maxDescriptionLength ? '...' : '')
    : product.description;

  const descriptionClass = isExpanded
    ? `${css.description} ${css.expanded}`
    : css.description;

  return (
    <div className={descriptionClass} ref={descriptionRef}>
      <h2 className={css.descriptionTitle}>Характеристики та опис</h2>
      <ul className={css.descriptionMenu}>
        <li className={css.descriptionText}>
          <p>{trimmedDescription}</p>
        </li>
      </ul>
      <CustomButton
        className={css.descriptionBtn}
        onClick={toggleExpand}
        disabled={product.description.length <= maxDescriptionLength}
        size="extraLarge"
        variant="another"
      >
        {isExpanded ? 'Згорнути' : 'Докладніше'}
      </CustomButton>
    </div>
  );
}
