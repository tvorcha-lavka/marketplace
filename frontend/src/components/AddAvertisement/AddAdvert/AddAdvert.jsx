import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { FiCamera } from 'react-icons/fi';
import CategoryModal from '../CategoryModal/CategoryModal';
import { selectFiltersCategory } from '../../../redux/filters/filtersSelector';
import { media } from '../../../utils/mediaConfig';
import css from './AddAdvert.module.css';
import { getFiltersCategory } from '../../../redux/filters/filtersOperations';

export default function AddAdvert() {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedChildCategory, setSelectedChildCategory] = useState(null);
  const [isSelectedDelivery, setIsSelectedDelivery] = useState([]);

  const filters = useSelector(selectFiltersCategory);

  console.log(filters);

  const dispatch = useDispatch();

  const deliveryType = ['Нова пошта', 'Укрпошта'];

  const handleDeliveryChange = (option) => {
    setIsSelectedDelivery(
      (prevSelected) =>
        prevSelected.includes(option)
          ? prevSelected.filter((item) => item !== option) // Видалити, якщо вже вибрано
          : [...prevSelected, option] // Додати новий варіант
    );
  };

  // const handleCategorySelect = (category) => {
  //   setSelectedCategory(category);
  //   setOpen(false);
  // };

  // const categoryFilters = filters?.filter(
  //   (filter) => filter.categoryId === selectedCategory.id
  // );

  const handleCategorySelect = (category) => {
    if (category.isChild) {
      setSelectedChildCategory(category);
    } else if (category.isSubCategory) {
      setSelectedSubCategory(category);
      setSelectedChildCategory(null); // Скинути вибір дитини, якщо вибрана нова підкатегорія
    } else {
      setSelectedCategory(category);
      setSelectedSubCategory(null); // Скинути підкатегорію, якщо вибрана нова основна категорія
      setSelectedChildCategory(null); // Скинути дитину, якщо вибрана нова основна категорія
    }
    setOpen(false);
  };

  // Фільтри для обраної категорії, підкатегорії або дитини
  const categoryFilters = filters?.filter(
    (filter) =>
      filter.categoryId === selectedCategory?.id ||
      filter.categoryId === selectedSubCategory?.id ||
      filter.categoryId === selectedChildCategory?.id
  );

  // useEffect(() => {
  //   if (
  //     selectedCategory?.id ||
  //     selectedSubCategory?.id ||
  //     selectedChildCategory?.id
  //   ) {
  //     dispatch(getFiltersCategory(selectedCategory.id));
  //   }
  // }, [dispatch, selectedCategory.id]);

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
              value={
                selectedChildCategory ||
                selectedSubCategory ||
                selectedCategory ||
                ''
              }
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
            <li className={css.fotoItem}>
              <FiCamera size={24} />
              <button className={css.btnFoto}>Завантажте</button>
              <p className={css.textFoto}>
                Головне фото товару
                <br /> в повному розмірі
              </p>
            </li>
            <li className={css.fotoItem}>
              <FiCamera size={24} />
              <button className={css.btnFoto}>Завантажте</button>
              <p className={css.textFoto}>
                Головне фото товару
                <br /> в повному розмірі
              </p>
            </li>
            <li className={css.fotoItem}>
              <FiCamera size={24} />
              <button className={css.btnFoto}>Завантажте</button>
              <p className={css.textFoto}>
                Головне фото товару
                <br /> в повному розмірі
              </p>
            </li>
            <li className={css.fotoItem}>
              <FiCamera size={24} />
              <button className={css.btnFoto}>Завантажте</button>
              <p className={css.textFoto}>
                Головне фото товару
                <br /> в повному розмірі
              </p>
            </li>
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
            {categoryFilters?.map((filter) => {
              if (filter.name !== 'Цвет')
                return (
                  <div key={filter.id}>
                    <label className={css.labelAdvert} htmlFor={filter.name}>
                      {filter.name}&#42;
                    </label>
                    <div className={css.dropdown}>
                      <select
                        className={css.selectAdvert}
                        name="style"
                        id={filter.name}
                      >
                        <option className={css.optionAdvert} value="">
                          Оберіть {filter.name.toLowerCase()}
                        </option>
                      </select>
                      <GoChevronDown className={css.selectIcon} size={24} />
                    </div>
                  </div>
                );
            })}
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
            <label className={css.labelAdvert} htmlFor="city">
              Місто&#42;
            </label>
            <div className={css.dropdown}>
              <select className={css.selectAdvert} name="style" id="city">
                <option className={css.optionAdvert} value="">
                  Оберіть місто
                </option>
                <option className={css.optionAdvert} value="">
                  Київ
                </option>
              </select>
              <GoChevronDown className={css.selectIcon} size={24} />
            </div>
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
                  type="checkbox"
                  name="delivery"
                  value={option}
                  checked={isSelectedDelivery.includes(option)}
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
