import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { FaRegHeart } from 'react-icons/fa';
import { IoNotificationsOutline } from 'react-icons/io5';
import { MdChatBubbleOutline } from 'react-icons/md';
import { GoChevronDown } from 'react-icons/go';

import CustomButton from '../ButtonElements/CustomButton/CustomButton';

import { selectLoggedIn } from '../../redux/auth/selectors';
import { media } from '../../utils/mediaConfig';

import css from './Header.module.css';

export default function HeaderUserControls({
  togglePopup,
  popupBtnRef,
  handleLoginClick,
}) {
  const isLoggedIn = useSelector(selectLoggedIn);
  const navigate = useNavigate();

  return (
    <ul className={css.rightPart}>
      {isLoggedIn ? (
        <>
          <li>
            <CustomButton
              type="button"
              size="small"
              onClick={() => navigate('/advertisement')}
            >
              Додати товар
            </CustomButton>
          </li>
          <li>
            <NavLink to="/cart">
              <FiShoppingCart className={css.shoppingIcon} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/like-cart">
              <FaRegHeart className={css.likeIcon} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-notice">
              <IoNotificationsOutline className={css.noticeIcon} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-chat">
              <MdChatBubbleOutline className={css.chatIcon} />
            </NavLink>
          </li>
          <li className={css.avatarItem}>
            <span className={css.avatar}>
              <img
                src={`${media}/profile/avatar.png`}
                alt="Avatar"
                className={css.avatarImage}
                width={40}
                height={40}
              />
            </span>
            <button
              type="button"
              className={css.popupBtn}
              onClick={togglePopup}
              ref={popupBtnRef}
            >
              <GoChevronDown className={css.popupIcon} />
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/like-cart">
              <FaRegHeart className={css.likeIcon} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart">
              <FiShoppingCart className={css.shoppingIcon} />
            </NavLink>
          </li>
          <li>
            <button
              type="button"
              className={css.loginButton}
              onClick={handleLoginClick}
            >
              <FiUser className={css.userIcon} />
            </button>
          </li>
        </>
      )}
    </ul>
  );
}
