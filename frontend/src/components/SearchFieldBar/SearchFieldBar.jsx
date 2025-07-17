import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoSearchOutline } from 'react-icons/io5';

import { searchProducts } from '../../redux/searchProducts/operations';
import {
  selectSearchHistory,
  selectSearchResults,
} from '../../redux/searchProducts/selectors';
import { addSearchHistory } from '../../redux/searchProducts/slice';

import SearchModal from './SearchModal';

import css from './SearchFieldBar.module.css';

export default function SearchFieldBar() {
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const results = useSelector(selectSearchResults);
  const searchHistory = useSelector(selectSearchHistory);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length >= 4) {
      dispatch(searchProducts(trimmedQuery));
    }
  }, [query, dispatch]);

  useEffect(() => {
    setShowModal(results.length > 0);
  }, [results]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const exact = results.find((r) => r.type === 'product' && r.exact_match);

    if (exact) {
      dispatch(addSearchHistory(exact));
      navigate(`/products/${exact.product_id}`, { state: { from: 'search' } });
      closeModal();
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    closeModal();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setQuery('');
  };

  return (
    <div className={css.searchBar}>
      <input
        placeholder="Пошук товару"
        autoComplete="off"
        className={css.input}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      <button type="button" className={css.iconButton} onClick={handleSearch}>
        <IoSearchOutline className={css.icon} />
      </button>
      {showModal && (
        <div className={css.modalBackdrop}>
          <SearchModal
            results={results}
            searchHistory={searchHistory}
            onClose={closeModal}
            addToSearchHistory={(r) => dispatch(addSearchHistory(r))}
          />
        </div>
      )}
    </div>
  );
}
