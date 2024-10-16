import { Link } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import sprite from '../../../public/icons/sprite.svg';

import Logo from '../Logo/Logo';
import Searchbar from '../Searchbar/SearchBar';
import AddItemButton from '../AddItemButton/AddItemButton';

import styles from './Header.module.css';
import { useRef, useState } from 'react';
import CatalogModal from '../CatalogModal/CatalogModal';

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
    }, 200); 
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!modalRef.current.contains(document.activeElement)) {
        setIsFocused(true);
      }
    }, 200); 
  };
	
  return (
    <section className={styles.section}>
      <div className={styles.firstPart}>
        <div className={styles.leftPart} >
          <Logo />
            <button
              className={styles.catalogBtn}
              onMouseEnter={handleMouseEnter}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              <svg width={32} height={32} stroke="black">
                <use href={`${sprite}#icon-burger`} />
              </svg>
              Каталог
            </button>
            {isFocused && (
              <div
                ref={modalRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <CatalogModal />
              </div>
            )}
          <Searchbar />
          <AddItemButton />
        </div>
        <div className={styles.rightPart}>
          <Link to="/cart">
            <svg width={24} height={24}>
              <use href={`${sprite}#icon-cart`} />
            </svg>
          </Link>
          <button className={styles.loginButton} onClick={handleLoginClick}>
            <svg width={32} height={32} stroke="black">
              <use href={`${sprite}#icon-user`} />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
