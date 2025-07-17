import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IoSearchOutline } from 'react-icons/io5';
import { PiSquaresFour } from 'react-icons/pi';

import { useClickOutside } from '../../hooks/useClickOutside';
import { saveFullPath } from '../../redux/searchProducts/slice';

import css from './SearchModal.module.css';

export default function SearchModal({
  results,
  searchHistory,
  onClose,
  addToSearchHistory,
}) {
  const dispatch = useDispatch();
  const modalRef = useClickOutside(onClose);

  const getLinkProps = (item) => {
    if (item.type === 'product') {
      return {
        to: `/categories/${item.id}/${item.product_id}`,
        state: {
          from: 'search',
          full_path: item.full_path,
          full_path_ids: item.full_path_ids,
        },
      };
    }

    const filterPart =
      item.filter_ids?.length > 0
        ? `?filters=${item.filter_ids.join(',')}`
        : '';
    return {
      to: `/categories/${item.id}${filterPart}`,
      state: {
        from: 'search',
        full_path: item.full_path,
      },
    };
  };

  return (
    <div ref={modalRef}>
      <ul className={css.menuItem}>
        {results.map((item, index) => (
          <li key={`${item.type}-${item.id}-${index}`} className={css.item}>
            <Link
              {...getLinkProps(item)}
              className={css.linkWrapper}
              onClick={() => {
                dispatch(
                  saveFullPath({
                    full_path: item.full_path,
                    full_path_ids: item.full_path_ids,
                  })
                );
                addToSearchHistory(item);
                onClose();
              }}
            >
              {item.type === 'product' ? (
                <IoSearchOutline className={css.icon} />
              ) : (
                <PiSquaresFour className={css.icon} />
              )}
              <div className={css.textWrapper}>
                <span className={css.title}>{item.title}</span>
                {item.full_path?.length > 0 && (
                  <p className={css.fullPath}>{item.full_path.join(' / ')}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {searchHistory.length > 0 && (
        <>
          <p className={css.text}>Останнім часом ви шукали:</p>
          <ul className={css.menuItem}>
            {searchHistory.map((item, index) => (
              <li key={`${item.type}-${item.id}-${index}`} className={css.item}>
                <Link
                  {...getLinkProps(item)}
                  className={css.linkWrapperHistory}
                  onClick={() => {
                    addToSearchHistory(item);
                    onClose();
                  }}
                >
                  <IoSearchOutline className={css.icon} />
                  <span className={css.title}>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
