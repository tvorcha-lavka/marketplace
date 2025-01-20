import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { FiCamera } from 'react-icons/fi';
import CategoryModal from '../CategoryModal/CategoryModal';
import { media } from '../../../utils/mediaConfig';
import css from './AddAdvert.module.css';

export default function AddAdvert() {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSelectedDelivery, setIsSelectedDelivery] = useState('');
  const deliveryType = ['Нова пошта', 'Укрпошта'];

  const handleDeliveryChange = (option) => {
    setIsSelectedDelivery(option);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setOpen(false);
  };

  return (
    <div className={css.addAdvertContainer}>
      <h2 className={css.advertTitle}>Додати оголошення</h2>
      <form action="">
        <fieldset className={css.wrapper}>
          <h3 className={css.title}>Виберіть категорію</h3>
          <label className={css.labelAdvert} htmlFor="categories">
            <p className={css.spanLabel}>Категорія&#42;</p>
          </label>
          <div className={css.categoryBox}>
            <input
              className={css.inputAdvert}
              id="categories"
              name="categories"
              value={selectedCategory}
              type="text"
              placeholder="Оберіть категорію"
              onClick={() => setOpen(!open)}
              readOnly
              required
            />
            <button type="button" onClick={() => setOpen(!open)}>
              {open ? (
                <GoChevronUp className={css.categoryIcon} size={24} />
              ) : (
                <GoChevronDown className={css.categoryIcon} size={24} />
              )}
            </button>
            {open && <CategoryModal onSelectCategory={handleCategorySelect} />}
          </div>
        </fieldset>
        <fieldset className={css.wrapper}>
          <h3 className={css.title}>Опишіть вашу річ</h3>
          <label className={css.labelAdvert}>
            <p className={css.spanLabel}>Назва (Українською Мовою)&#42;</p>
            <input
              className={css.inputNameItem}
              type="text"
              name="title"
              id="title"
              placeholder="Наприклад: Українська традиційна вишиванка жіночка Львівська"
              required
            />
          </label>
          <label className={css.labelAdvert}>
            <p className={css.spanLabel}>Опис (Українською Мовою)&#42;</p>
            <textarea name="description" id="description" rows="5" required />
          </label>
        </fieldset>
        <fieldset className={css.wrapper}>
          <h3 className={css.title}>
            Завантажте фото
            <span className={css.advertSpan}>(0 з 10 завантажено)</span>
          </h3>

          <ul className={css.fotoList}>
            <li className={css.fotoItem}>
              <FiCamera size={24} />
              <button className={css.btnFoto}>Завантажте</button>
              <p className={css.textFoto}>
                Головне фото товару
                <br /> в повному розмірі
              </p>
            </li>
          </ul>
        </fieldset>
        <fieldset className={css.wrapper}>
          <h3 className={css.title}>Додайте характеристики</h3>
          <div className={css.detailbox}>
            <label className={css.labelAdvert} htmlFor="">
              <p className={css.spanLabel}>Матеріал&#42;</p>
              <select className={css.selectAdvert} name="style" id="material">
                <option value="">Оберіть матеріал</option>
              </select>
            </label>
            <label className={css.labelAdvert} htmlFor="style">
              <p className={css.spanLabel}>Стиль&#42;</p>
              <select className={css.selectAdvert} name="style" id="style">
                <option value="">Оберіть стиль</option>
              </select>
            </label>
            <label className={css.labelAdvert} htmlFor="decoration">
              <p className={css.spanLabel}>Оздоблення&#42;</p>
              <select
                className={css.selectAdvert}
                name="decoration"
                id="decoration"
              >
                <option value="">Оберіть оздоблення</option>
              </select>
            </label>
          </div>
        </fieldset>
        <fieldset className={css.wrapper}>
          <h3 className={css.title}>Виберіть до 2 кольорів</h3>
        </fieldset>
        <fieldset className={css.wrapper}>
          <h3 className={css.title}>Ключові слова</h3>
        </fieldset>
        <fieldset className={css.wrapper}>
          <h3 className={css.title}>Додатково</h3>
          {[
            'З гравіюванням',
            'Екологічні товари',
            'Україньска символіка',
            'Під замовлення',
          ].map((option, index) => (
            <label key={index} className={css.option_label}>
              <input
                type="checkbox"
                value={option}
                // checked={activeFilters[filter.id]?.includes(option) ?? false}
                // onChange={() => handleToggleFilter(filter.id, option)}
              />
              <span className={css.checkmark}></span>
              {option}
            </label>
          ))}
        </fieldset>
        <fieldset className={css.wrapper}>
          <h3 className={css.title}>Локалізація</h3>
          <div className={css.locationBox}>
            <label className={css.labelAdvert} htmlFor="">
              <p className={css.spanLabel}>Місто&#42;</p>
              <select className={css.selectAdvert}></select>
            </label>
          </div>
        </fieldset>
        <fieldset className={css.wrapper}>
          <h3 className={css.title}>Умови продажу</h3>
          <div className={css.priceBox}>
            <label className={css.labelAdvert} htmlFor="">
              <p className={css.spanLabel}>Ціна&#42;</p>
              <input className={css.inputAdvert} type="number" />
            </label>
          </div>
        </fieldset>
        <fieldset className={css.wrapper}>
          <h3 className={css.title}>
            Виберіть спосіб доставки
            <span className={css.advertSpan}>
              Оберіть зручний спосіб доставки для ваших товарів (можна кілька).
              За потреби ви легко зможете змінити його у своєму особистому
              кабінеті.
            </span>
          </h3>

          <div className={css.deliveryBox}>
            {deliveryType.map((option, index) => (
              <label htmlFor={option} key={index} className={css.deliveryLabel}>
                <input
                  id={option}
                  type="radio"
                  name="delivery"
                  value={option}
                  checked={isSelectedDelivery === option}
                  onChange={() => handleDeliveryChange(option)}
                />
                <span className={css.checkmark}></span>

                <img
                  className={css.deliveryImg}
                  src={
                    option.includes('Укрпошта')
                      ? `${media}/logo/ukrposhta_logo.png`
                      : `${media}/logo/Nova_Poshta_logo.png`
                  }
                  alt={option}
                />
              </label>
            ))}
          </div>
        </fieldset>
        <button
          className={css.btnContinue}
          type="submit"
          // onClick={handleSubmit}
          // disabled={!paymentData.type}
        >
          Опублікувати оголошення
        </button>
      </form>
    </div>
  );
}
