import { useDispatch } from 'react-redux';

import CustomButton from '../../CustomButton/CustomButton';
import { addToBasket } from '../../../redux/basket/slice';

import css from './ProductDetailsInfo.module.css';

export default function ProductDetailsInfo({ onClick, product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToBasket(product));
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
        Додати до кошика
      </CustomButton>
    </div>
  );
}
