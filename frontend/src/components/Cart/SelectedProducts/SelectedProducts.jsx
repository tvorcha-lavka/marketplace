import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import CartProduct from '../CartProduct/CartProduct';
import CustomEditButton from '../../ButtonElements/CustomEditButton/CustomEditButton';
import SelectedProductsSkeleton from './SelectedProductsSkeleton';

import { selectBasketItems } from '../../../redux/basket/selectors';
import useDelayedLoading from '../../../hooks/useDelayedLoading';

import css from './SelectedProducts.module.css';

export default function SelectedProducts() {
  const items = useSelector(selectBasketItems);

  const delayedLoading = useDelayedLoading();
  if (delayedLoading) {
    return <SelectedProductsSkeleton />;
  }

  return (
    <div className={css.orderShoppingSection}>
      <div className={css.goodsEdit}>
        <p className={css.quantityGoods}>Ваш кошик ({items.length})</p>
        <Link to="/cart" className={css.editBox}>
          <CustomEditButton>Редагувати</CustomEditButton>
        </Link>
      </div>
      <div className="scrollBox">
        <div className="scrollBoxInner">
          <ul>
            {items.map((item) => (
              <CartProduct
                key={item.id}
                item={item}
                showSeller={true}
                showRemoveButton={false}
                variant="default"
                titleBoxWidth="316px"
                className={css.cartItem}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
