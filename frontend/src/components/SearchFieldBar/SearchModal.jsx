import { Link } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';

import { useClickOutside } from '../../hooks/useClickOutside';

import css from './SearchModal.module.css';

export default function SearchModal({
  results,
  searchHistory,
  onClose,
  addToSearchHistory,
}) {
  const modalRef = useClickOutside(onClose);

  return (
    <div ref={modalRef}>
      <ul className={css.menuItem}>
        {results.map((product) => (
          <li className={css.item} key={product.id}>
            <Link
              to={`/${product.id}`}
              state={{ from: 'search', searchResults: results }}
              className={css.linkWrapper}
              onClick={() => {
                addToSearchHistory({ id: product.id, title: product.title });
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
            {searchHistory.map(({ id, title }) => (
              <li key={`${id}-${title}`} className={css.item}>
                <Link
                  to={`/${id}`}
                  state={{ from: 'search' }}
                  className={css.linkWrapper}
                  onClick={() => {
                    addToSearchHistory({ id, title });
                    onClose();
                  }}
                >
                  <IoSearchOutline className={css.icon} />
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
