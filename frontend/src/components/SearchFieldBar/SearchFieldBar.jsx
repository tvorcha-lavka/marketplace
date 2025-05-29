import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoSearchOutline } from 'react-icons/io5';

import { getProducts } from '../../redux/products/operations';
import { selectProducts } from '../../redux/products/selectors';

import SearchModal from './SearchModal';

import css from './SearchFieldBar.module.css';

export default function SearchFieldBar() {
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('searchHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allProducts = useSelector(selectProducts)?.results || [];

  useEffect(() => {
    if (allProducts.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, allProducts.length]);

  const filteredResults = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery.length < 2) return [];
    return allProducts.filter((product) =>
      product.title.toLowerCase().includes(trimmedQuery)
    );
  }, [query, allProducts]);

  const addToSearchHistory = (term) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    setSearchHistory((prev) => {
      const newHistory = [
        trimmedTerm,
        ...prev.filter((q) => q !== trimmedTerm),
      ];
      localStorage.setItem(
        'searchHistory',
        JSON.stringify(newHistory.slice(0, 10))
      );
      return newHistory.slice(0, 10);
    });
  };

  useEffect(() => {
    setShowModal(filteredResults.length > 0);
  }, [filteredResults]);

  const handleInputChange = (e) => setQuery(e.target.value);

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    if (filteredResults.length > 0) {
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate('/empty-search');
    }

    setQuery('');
    setShowModal(false);
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
      <IoSearchOutline className={css.icon} onClick={handleSearch} />

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
