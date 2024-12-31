import { Link } from 'react-router-dom';
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

  const handleLoginClick = () => {
    openModal('login');
  };

  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!modalRef.current.contains(document.activeElement)) {
        setIsFocused(false);
      }
    }, 100);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!modalRef.current.contains(document.activeElement)) {
        setIsFocused(true);
      }
    }, 100);
  };

  return (
    <section className={css.section}>
      <div className={css.container}>
        <div className={css.leftPart}>
          <Logo className={css.logoIndent} />
          <button
            className={css.catalogBtn}
            onMouseEnter={handleMouseEnter}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <HiMiniBars4 className={css.burgerIcon} />
            Каталог
          </button>
          {isFocused && (
            <div
              ref={modalRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <CatalogModal noFocuseModal={() => setIsFocused(false)} />
            </div>
          )}

          <SearchFieldBar />

          <CustomButton size="small">Додати товар</CustomButton>
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
      <HeaderDown />
    </section>
  );
}
