import { useSelector } from 'react-redux';

import CartProduct from '../CartProduct/CartProduct';
import EmptyCartMessage from '../EmptyCartMessage/EmptyCartMessage';
import ShoppingCartSkeleton from './ShoppingCartSkeleton';

import { selectBasketItems } from '../../../redux/basket/selectors';
import useDelayedLoading from '../../../hooks/useDelayedLoading';

import css from './ShoppingCart.module.css';

export default function ShoppingCart() {
  const items = useSelector(selectBasketItems);

  const delayedLoading = useDelayedLoading();
  if (delayedLoading) {
    return <ShoppingCartSkeleton />;
  }

  return (
    <div className={css.shoppingBox}>
      {items.length === 0 ? (
        <EmptyCartMessage />
      ) : (
        <>
          <h3 className={css.title}>
            Предмети у вашому кошику
            <span>&nbsp;({items.length})</span>
          </h3>

          <div className="scrollBox">
            <div className="scrollBoxInner">
              <ul>
                {items.map((item) => (
                  <CartProduct
                    key={item.id}
                    item={item}
                    showSeller={true}
                    showRemoveButton={true}
                    variant="shop"
                    titleBoxWidth="494px"
                    className={css.cartItemShop}
                  />
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
