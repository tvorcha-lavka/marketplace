import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../ButtonElements/CustomButton/CustomButton';
import ModalBtnCross from '../../ButtonElements/ModalBtnCross/ModalBtnCross';
import BasketDetailsModal from '../BasketDetailsModal/BasketDetailsModal';
import showToast from '../../Toasts/showToast';

import { addToBasket } from '../../../redux/basket/slice';
import { selectBasketItems } from '../../../redux/basket/selectors';
import { useClickEsc } from '../../../hooks/useClickEsc';
import useNoScroll from '../../../hooks/useNoScroll';

import css from './ProductDetailsInfo.module.css';

export default function ProductDetailsInfo({ product }) {
  const [isOpenBasketDetailsModal, setIsOpenBasketDetailsModal] =
    useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const transferOrder = () => {
    navigate('/cart');
  };

  const basketItems = useSelector(selectBasketItems);

  const isProductInBasket = basketItems.some((item) => item.id === product.id);

  useEffect(() => {
    setIsAdded(isProductInBasket);
  }, [isProductInBasket]);

  const handleAddToCart = () => {
    if (!isAdded) {
      dispatch(addToBasket(product));
    }
  };

  const handleClick = () => {
    if (!isAdded) {
      handleAddToCart();
      showToast('Товар додано до кошика!', 'success');
    } else {
      setIsOpenBasketDetailsModal(true);
    }
  };

  const closeModalDetails = () => {
    setIsOpenBasketDetailsModal(false);
  };

  useNoScroll(isOpenBasketDetailsModal);

  const modalRef = useClickEsc(closeModalDetails);

  if (!product) return null;

  return (
    <div className={css.orderInfo}>
      <p className={css.publicDate}>
        Опубліковано&nbsp;{product.date_published}
      </p>
      <h1 className={css.cartTitle}>{product.title}</h1>
      <p className={css.price}>{product.price}&nbsp;грн.</p>
      <CustomButton
        size="auto"
        onClick={transferOrder}
        className={css.deliveryBtn}
      >
        Замовити з доставкою
      </CustomButton>
      <CustomButton size="auto" variant="another" onClick={handleClick}>
        {isAdded ? 'Переглянути обране у кошику' : 'Додати до кошика'}
      </CustomButton>

      {isOpenBasketDetailsModal && (
        <div className={css.modalBackdrop}>
          <div className={css.modalBasketContent} ref={modalRef}>
            <BasketDetailsModal />
            <ModalBtnCross onClick={closeModalDetails} />
          </div>
        </div>
      )}
    </div>
  );
}
