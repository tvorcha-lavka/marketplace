import { Link } from 'react-router-dom';
import { LiaEditSolid } from 'react-icons/lia';
import { useSelector } from 'react-redux';

import CartProduct from '../CartProduct/CartProduct';

import { selectBasketItems } from '../../../redux/basket/selectors';

import css from './SelectedProducts.module.css';

export default function SelectedProducts() {
  const items = useSelector(selectBasketItems);

  return (
    <div className={css.orderShoppingSection}>
      <div className={css.goodsEdit}>
        <p className={css.quantityGoods}>Ваш кошик ({items.length})</p>
        <Link to="/cart" className={css.editBox}>
          <p className={css.edit}>Редагувати</p>
          <LiaEditSolid size={16} />
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
