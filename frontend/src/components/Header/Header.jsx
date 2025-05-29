import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { HiMiniBars4 } from 'react-icons/hi2';
import { FaRegHeart } from 'react-icons/fa';

import Logo from '../Logo/Logo';
import SearchFieldBar from '../SearchFieldBar/SearchFieldBar';
import CatalogModal from '../CatalogModal/CatalogModal';
import HeaderDown from '../HeaderDown/HeaderDown';
import CustomButton from '../CustomButton/CustomButton';

import { useModal } from '../../hooks/useModal';

import css from './Header.module.css';

export default function Header() {
  const { openModal } = useModal();
  const [isFocused, setIsFocused] = useState(false);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  let closeTimeout = useRef(null);
  const navigate = useNavigate();

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

            <CustomButton
              size="small"
              onClick={() => navigate('/advertisement')}
            >
              Додати товар
            </CustomButton>
          </div>
          <div className={css.rightPart}>
            <Link to="/like-cart">
              <FaRegHeart className={css.likeIcon} />
            </Link>
            <Link to="/cart">
              <FiShoppingCart className={css.shoppingIcon} />
            </Link>
            <button className={css.loginButton} onClick={handleLoginClick}>
              <FiUser className={css.userIcon} />
            </button>
          </div>
        </div>
      </div>
      <HeaderDown />
    </header>
  );
}
