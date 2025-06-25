import { useState, useRef } from 'react';

import CustomButton from '../../ButtonElements/CustomButton/CustomButton';

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
      {product.description.length > maxDescriptionLength && (
        <CustomButton
          className={css.descriptionBtn}
          onClick={toggleExpand}
          size="auto"
          variant="another"
        >
          {isExpanded ? 'Згорнути' : 'Докладніше'}
        </CustomButton>
      )}
    </div>
  );
}
