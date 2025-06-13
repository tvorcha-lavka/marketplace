import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';

import CustomButton from '../../CustomButton/CustomButton';
import ModalBtnCross from '../../ModalBtnCross/ModalBtnCross';
import BasketDetailsModal from '../BasketDetailsModal/BasketDetailsModal';

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
    navigate('/order');
  };

  const handleContinueShopping = () => {
    toast.custom(() => (
      <div
        style={{
          backgroundColor: 'var(--primary-yellow-lighter)',
          color: 'var(--default-black)',
          width: '279px',
          height: '64px',
          padding: '20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: 'var(--font-size-tiny)',
          fontWeight: 'var(--font-weight-bold)',
          borderLeft:
            'var(--border-width-biggest) var(--border-style) var(--primary-yellow)',
          boxShadow: 'var(--cart-shadow)',
        }}
      >
        <FiCheckCircle style={{ fontSize: '24px' }} />
        Товар додано до кошика
      </div>
    ));
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
      handleContinueShopping();
    } else {
      setIsOpenBasketDetailsModal(true);
    }
  };

  const closeModalDetails = () => {
    setIsOpenBasketDetailsModal(false);
  };

  useNoScroll(isOpenBasketDetailsModal);

  const modalRef = useClickEsc(closeModalDetails);

  return (
    <div className={css.orderInfo}>
      <p className={css.publicDate}>
        Опубліковано&nbsp;{product.date_published}
      </p>
      <h1 className={css.cartTitle}>{product.title}</h1>
      <p className={css.price}>{product.price}&nbsp;грн.</p>
      <CustomButton
        size="large"
        onClick={transferOrder}
        className={css.deliveryBtn}
      >
        Замовити з доставкою
      </CustomButton>
      <CustomButton size="large" variant="another" onClick={handleClick}>
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
