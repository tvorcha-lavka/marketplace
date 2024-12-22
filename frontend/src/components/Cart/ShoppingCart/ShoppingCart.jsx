import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineDelete } from 'react-icons/ai';
import { toggleSelectItem, removeItem } from '../../../redux/cart/cartSlice';
import { selectCartItems } from '../../../redux/cart/cartSelector';
import { media } from '../../../utils/mediaConfig';
import css from './ShoppingCart.module.css';

// const cartItemsData = [
//   {
//     id: 1,
//     title: 'Українська традиційна вишиванка жінoча Львівська',
//     seller: 'Lesia_OK12',
//     size: 'M',
//     material: 'Льон',
//     condition: 'Новий',
//     price: 599,
//     image: 'path/to/image2.jpg',
//     selected: false,
//   },
//   {
//     id: 2,
//     title: 'Українська традиційна вишиванка жінoча Львівська',
//     seller: 'Lesia_OK12',
//     size: 'M',
//     material: 'Льон',
//     condition: 'Новий',
//     price: 599,
//     image: 'path/to/image2.jpg',
//     selected: false,
//   },
//   {
//     id: 3,
//     title: 'Українська традиційна вишиванка жінoча Львівська',
//     seller: 'Lesia_OK12',
//     size: 'M',
//     material: 'Льон',
//     condition: 'Новий',
//     price: 599,
//     image: 'path/to/image3.jpg',
//     selected: false,
//   },
//   {
//     id: 4,
//     title: 'Українська традиційна вишиванка жінoча Львівська',
//     seller: 'Lesia_OK12',
//     size: 'M',
//     material: 'Льон',
//     condition: 'Новий',
//     price: 599,
//     image: 'path/to/image4.jpg',
//     selected: false,
//   },
// ];

export default function ShoppingCart({ updateTotalPrice }) {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  // const toggleSelectItem = (id) => {
  //   const updatedItems = cartItems.map((item) =>
  //     item.id === id ? { ...item, selected: !item.selected } : item
  //   );
  // setCartItems(updatedItems);

  // Calculate and update total price
  //   const totalPrice = updatedItems
  //     .filter((item) => item.selected)
  //     .reduce((sum, item) => sum + item.price, 0);
  //   updateTotalPrice(totalPrice);
  // };
  // const removeItem = (id) => {
  //   const updatedItems = cartItems.filter((item) => item.id !== id);
  //   // setCartItems(updatedItems);
  //   const totalPrice = updatedItems
  //     .filter((item) => item.selected)
  //     .reduce((sum, item) => sum + item.price, 0);

  //   updateTotalPrice(totalPrice);
  // };

  return (
    <div className={css.scrollbox}>
      <div className={css.scrollbox_inner}>
        <ul className={css.cart_list}>
          {cartItems.map((item) => (
            <li key={item.id} className={css.cart_item}>
              <input
                type="checkbox"
                className={css.checkbox}
                checked={item.selected}
                onChange={() => dispatch(toggleSelectItem(item.id))}
              />
              <img
                className={css.item_img}
                src={`${media}/page/404/not-found.png`}
                alt={item.title}
              />
              <div className={css.item_details}>
                <h3 className={css.item_title}>{item.title}</h3>
                <p className={css.item_seller}>
                  Продавець:
                  <span className={css.seller_name}>{item.seller}</span>
                </p>
                <div className={css.item_filter}>
                  <p>Розмір: {item.size}</p>
                  <p>Матеріал: {item.material}</p>
                  <p>Стан: {item.condition}</p>
                </div>
              </div>
              <p className={css.item_price}>{item.price} грн</p>
              <button
                className={css.remove_btn}
                type="button"
                onClick={() => dispatch(removeItem(item.id))}
              >
                <AiOutlineDelete color="red" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
