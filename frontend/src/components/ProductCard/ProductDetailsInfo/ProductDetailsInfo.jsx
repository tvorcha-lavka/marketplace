import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../../CustomButton/CustomButton';
import { addToBasket } from '../../../redux/basket/slice';
import { selectBasketItems } from '../../../redux/basket/selectors';

import css from './ProductDetailsInfo.module.css';

export default function ProductDetailsInfo({ onClick, product }) {
  const [isAdded, setIsAdded] = useState(false);
	const dispatch = useDispatch();

	const basketItems = useSelector(selectBasketItems);

  const isProductInBasket = basketItems.some((item) => item.id === product.id);

    useEffect(() => {
      setIsAdded(isProductInBasket);
    }, [isProductInBasket]);

    const handleAddToCart = () => {
      if (!isAdded) {
        dispatch(addToBasket(product)); 
      }
      onClick();
    };
	
	return (
    <div className={css.orderInfo}>
      <p className={css.publicDate}>
        Опубліковано&nbsp;{product.date_published}
      </p>
      <h1 className={css.cartTitle}>{product.title}</h1>
      <p className={css.price}>{product.price}&nbsp;грн.</p>
      <CustomButton size="large" className={css.deliveryBtn}>
        Замовити з доставкою
      </CustomButton>
      <CustomButton size="large" variant="another" onClick={handleAddToCart}>
        {isAdded ? 'Додано до кошика' : 'Додати до кошика'}
      </CustomButton>
    </div>
  );
}
