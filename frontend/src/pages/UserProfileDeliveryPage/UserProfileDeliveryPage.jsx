import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { CiDeliveryTruck } from 'react-icons/ci';

import CustomButton from '../../components/ButtonElements/CustomButton/CustomButton';
import CustomEditButton from '../../components/ButtonElements/CustomEditButton/CustomEditButton';
import CheckboxInput from '../../components/FormElements/CheckboxInput/CheckboxInput';

import { selectAdvertsDetails } from '../../redux/addAdverts/selectors';
import { setField } from '../../redux/addAdverts/slice';
import { deliveryType } from '../../utils/cartDetails';

import css from './UserProfileDeliveryPage.module.css';

export default function UserProfileDeliveryPage() {
  const dispatch = useDispatch();
  const { isSelectedDelivery } = useSelector(selectAdvertsDetails);

  const [editMode, setEditMode] = useState(false);
  const [localSelection, setLocalSelection] = useState(
    Array.isArray(isSelectedDelivery) ? isSelectedDelivery : []
  );

  const handleToggleEdit = () => setEditMode((prev) => !prev);

  const handleDeliveryChange = (option) => {
    const updated = localSelection.includes(option)
      ? localSelection.filter((item) => item !== option)
      : [...localSelection, option];

    setLocalSelection(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setField({ field: 'isSelectedDelivery', value: localSelection }));
    setEditMode(false);
  };

  return (
    <div className={css.container}>
      <div className={css.wrap}>
        <h2 className={css.title}>Способи доставки</h2>
        {!editMode && (
          <CustomEditButton onClick={handleToggleEdit}>
            Редагувати
          </CustomEditButton>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit}>
          <p className={css.text}>
            Оберіть зручний спосіб доставки для ваших товарів (можна кілька)
          </p>
          <ul className={css.deliveryBox}>
            {deliveryType.map(({ name, img, width, height }) => {
              const isChecked = localSelection.includes(name);

              return (
                <li key={name}>
                  <CheckboxInput
                    id={name}
                    name={name}
                    checked={isChecked}
                    onChange={() => handleDeliveryChange(name)}
                    icon={() => (
                      <img width={width} height={height} src={img} alt={name} />
                    )}
                    variant="image"
                    width="224px"
                  />
                </li>
              );
            })}
          </ul>

          <CustomButton
            type="submit"
            variant="default"
            size="small"
            className={css.btn}
          >
            Зберегти зміни
          </CustomButton>
        </form>
      ) : isSelectedDelivery?.length > 0 ? (
        <ul className={css.deliveryBox}>
          {deliveryType
            .filter(({ name }) => isSelectedDelivery.includes(name))
            .map(({ name, img, width, height }) => (
              <li key={name} className={css.deliveryBoxItem}>
                <img width={width} height={height} src={img} alt={name} />
              </li>
            ))}
        </ul>
      ) : (
        <div className={css.emptyDelivery}>
          <span>
            <CiDeliveryTruck className={css.iconDelivery} />
          </span>

          <p className={css.text}>Наразі спосіб доставки не обрано</p>
        </div>
      )}
    </div>
  );
}
