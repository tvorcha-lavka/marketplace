import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HiMiniBars4 } from 'react-icons/hi2';

import Logo from '../Logo/Logo';
import SearchFieldBar from '../SearchFieldBar/SearchFieldBar';
import CatalogModal from '../CatalogModal/CatalogModal';
import HeaderDown from '../HeaderDown/HeaderDown';
import HeaderUserPopup from '../HeaderUserPopup/HeaderUserPopup';
import HeaderUserControls from './HeaderUserControls';

import { useModal } from '../../hooks/useModal';
import { selectLoggedIn } from '../../redux/auth/selectors';

import css from './Header.module.css';

export default function Header() {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const { openModal } = useModal();
  const [isFocused, setIsFocused] = useState(false);

  const isLoggedIn = useSelector(selectLoggedIn);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const userPopupRef = useRef(null);
  const popupBtnRef = useRef(null);
  const closeTimeout = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsOpenPopup(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpenPopup &&
        userPopupRef.current &&
        !userPopupRef.current.contains(event.target) &&
        popupBtnRef.current &&
        !popupBtnRef.current.contains(event.target)
      ) {
        setIsOpenPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpenPopup]);

  const togglePopup = () => {
    setIsOpenPopup((prev) => !prev);
  };

  const handleLoginClick = () => {
    openModal('login');
  };

  const handleOpen = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsFocused(true);
  };

  const handleCloseWithDelay = () => {
    closeTimeout.current = setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleBlur = (event) => {
    if (!modalRef.current.contains(event.relatedTarget)) {
      handleCloseWithDelay();
    }
  };

  return (
    <header>
      <div className="container">
        <div className={css.wrapper}>
          <div className={css.leftPart}>
            <Logo />
            <button
              type="button"
              className={css.catalogBtn}
              ref={buttonRef}
              onFocus={handleOpen}
              onBlur={handleBlur}
              onMouseEnter={handleOpen}
              onMouseLeave={handleCloseWithDelay}
            >
              <HiMiniBars4 className={css.burgerIcon} />
              Каталог
            </button>
            {isFocused && (
              <div
                tabIndex={-1}
                ref={modalRef}
                onMouseEnter={handleOpen}
                onMouseLeave={handleCloseWithDelay}
              >
                <CatalogModal noFocuseModal={() => setIsFocused(false)} />
              </div>
            )}

            <SearchFieldBar />
          </div>

          <ul className={css.rightPart}>
            <HeaderUserControls
              togglePopup={togglePopup}
              popupBtnRef={popupBtnRef}
              handleLoginClick={handleLoginClick}
            />
          </ul>

          {isOpenPopup && (
            <div className={css.modalBackdrop}>
              <div className={css.modal} ref={userPopupRef}>
                <HeaderUserPopup
                  isOpenPopup={isOpenPopup}
                  onClose={() => setIsOpenPopup(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <HeaderDown />
    </header>
  );
}
