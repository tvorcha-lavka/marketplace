import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoSearchOutline } from 'react-icons/io5';

import { searchProducts } from '../../redux/products/operations';
import {
  selectSearchHistory,
  selectSearchResults,
} from '../../redux/products/selectors';
import { addSearchHistory } from '../../redux/products/slice';

import SearchModal from './SearchModal';

import css from './SearchFieldBar.module.css';

export default function SearchFieldBar() {
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allProducts = useSelector(selectSearchResults);
  const searchHistory = useSelector(selectSearchHistory);

  useEffect(() => {
    if (query.trim().length >= 2) {
      dispatch(searchProducts(query));
    }
  }, [query, dispatch]);

  const filteredResults = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery.length < 2) return [];
    return allProducts.filter((product) =>
      product.title.toLowerCase().includes(trimmedQuery)
    );
  }, [query, allProducts]);

  const addToSearchHistory = (term) => {
    dispatch(addSearchHistory(term));
  };

  useEffect(() => {
    setShowModal(filteredResults.length > 0);
  }, [filteredResults]);

  const handleInputChange = (e) => setQuery(e.target.value);

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const lowerQuery = trimmedQuery.toLowerCase();

    const exactMatch = allProducts.find(
      (product) => product.title.toLowerCase() === lowerQuery
    );

    if (exactMatch) {
      dispatch(
        addSearchHistory({ id: exactMatch.id, title: exactMatch.title })
      );
      navigate(`/${exactMatch.id}`, { state: { from: 'search' } });
      closeModal();
      return;
    }

    dispatch(addSearchHistory(trimmedQuery));

    if (filteredResults.length > 0) {
      navigate('/empty-search');
      closeModal();
    } else {
      navigate('/empty-search');
      closeModal();
    }

    setQuery('');
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
            results={filteredResults}
            searchHistory={searchHistory}
            onClose={closeModal}
            addToSearchHistory={addToSearchHistory}
          />
        </div>
      )}
    </div>
  );
}
