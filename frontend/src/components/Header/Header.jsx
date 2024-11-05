import { Link } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import { useRef, useState } from 'react';
import { FiShoppingCart } from "react-icons/fi";
import sprite from '../../../public/icons/sprite.svg';
import Logo from '../Logo/Logo';
import Searchbar from '../Searchbar/SearchBar';
import AddItemButton from '../AddItemButton/AddItemButton';
import CatalogModal from '../CatalogModal/CatalogModal';
import HeaderDown from '../HeaderDown/HeaderDown';
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
      <div className={css.firstPart}>
        <div className={css.leftPart} >
          <Logo />
            <button
              className={css.catalogBtn}
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
                <CatalogModal noFocuseModal={() => setIsFocused(false)} />
              </div>
            )}
          <Searchbar />
          <AddItemButton />
        </div>
        <div className={css.rightPart}>
          <Link to="/cart">
            <FiShoppingCart size={24} color='#000'/>
          </Link>
          <button className={css.loginButton} onClick={handleLoginClick}>
            <svg width={32} height={32} stroke="black">
              <use href={`${sprite}#icon-user`} />
            </svg>
          </button>
        </div>
      </div>
      <HeaderDown />
    </section>
  );
}
