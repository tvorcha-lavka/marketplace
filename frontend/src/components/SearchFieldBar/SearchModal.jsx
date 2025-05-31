import { Link } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';

import css from './SearchModal.module.css';

export default function SearchModal({
  results,
  searchHistory,
  onClose,
  addToSearchHistory,
}) {
  return (
    <>
      <ul className={css.menuItem}>
        {results.map((product) => (
          <li className={css.item} key={product.id}>
            <Link
              to={`/cards/${product.id}`}
              state={{ from: 'search' }}
              className={css.linkWrapper}
              onClick={() => {
                addToSearchHistory(product.title);
                onClose();
              }}
            >
              <IoSearchOutline className={css.icon} />
              {product.title}
            </Link>
          </li>
        ))}
      </ul>

      {searchHistory.length > 0 && (
        <>
          <p className={css.text}>Останнім часом ви шукали:</p>
          <ul className={css.menu}>
            {searchHistory.map((term, index) => (
              <li className={css.item} key={index}>
                <IoSearchOutline className={css.icon} />
                <p>{term}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
