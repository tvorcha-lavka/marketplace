import React, { useCallback, useEffect, useState } from 'react';
import { MdChevronRight, MdChevronLeft } from 'react-icons/md';
import css from './Pagination.module.css';

export default function Pagination({ currentPage, onPageChange }) {
  const [displayedPages, setDisplayedPages] = useState([]);
  const totalPages = 9;
  const updatePages = useCallback(
    (page) => {
      const totalDisplayedPages = 4;
      const halfTotalDisplayedPages = Math.floor(totalDisplayedPages / 2);

      let startPage = Math.max(page - halfTotalDisplayedPages, 1);
      let endPage = Math.min(startPage + totalDisplayedPages - 1, totalPages);

      if (endPage - startPage < totalDisplayedPages - 1) {
        startPage = Math.max(endPage - totalDisplayedPages + 1, 1);
      }

      const newPages = Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index
      );
      setDisplayedPages(newPages);
    },
    [totalPages]
  );
  useEffect(() => {
    updatePages(currentPage);
  }, [currentPage, updatePages]);

  const handlePageClick = (page) => {
    onPageChange(page);
    updatePages(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      updatePages(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      updatePages(currentPage + 1);
    }
  };

  return (
    <div className={css.container}>
      <button className={css.btn_pagination} onClick={handlePrevClick}>
        <MdChevronLeft size={32} />
      </button>
      <div className={css.pagination_number}>
        {displayedPages.map((page) => (
          <button
            className={
              currentPage === page ? `${css.active}` : `${css.btn_number}`
            }
            key={page}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages - 1 && (
          <>
            <p>...</p>
            <button className={css.btn_number}>{totalPages}</button>
          </>
        )}
      </div>
      <button className={css.btn_pagination} onClick={handleNextClick}>
        <MdChevronRight size={32} />
      </button>
    </div>
  );
}
