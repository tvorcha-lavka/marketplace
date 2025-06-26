import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import CustomButton from '../../ButtonElements/CustomButton/CustomButton';
import EmptyCartMessage from '../../Cart/EmptyCartMessage/EmptyCartMessage';
import CartProduct from '../../Cart/CartProduct/CartProduct';

import {
  selectTotal,
  selectBasketItems,
} from '../../../redux/basket/selectors';

import css from './BasketDetailsModal.module.css';

export default function BasketDetailsModal() {
  const navigate = useNavigate();
  const cartItems = useSelector(selectBasketItems);
  const total = useSelector(selectTotal);

  const transferOrder = () => {
    navigate('/cart');
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <EmptyCartMessage />
      ) : (
        <>
          <h4 className={css.trashListTitle}>
            Ваш кошик ({cartItems.length} предмети)
          </h4>

          <ul className={`${css.scrollContainer} scrollBox scrollBoxInner`}>
            {cartItems.map((item) => {
              return (
                <CartProduct
                  key={item.id}
                  item={item}
                  showSeller={true}
                  showRemoveButton={true}
                  variant="default"
                  titleBoxWidth="290px"
                  className={css.cartItem}
                />
              );
            })}
          </ul>

          <p className={css.priceSummary}>
            Разом: {typeof total === 'number' ? total.toFixed(2) : '0.00'} грн.
          </p>

          <CustomButton onClick={transferOrder} variant="default" size="auto">
            Перейти до оформлення
          </CustomButton>
        </>
      )}
    </>
  );
}
