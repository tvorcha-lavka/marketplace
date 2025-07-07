import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import CustomButton from '../../components/ButtonElements/CustomButton/CustomButton';
import CustomEditButton from '../../components/ButtonElements/CustomEditButton/CustomEditButton';
import CheckboxInput from '../../components/FormElements/CheckboxInput/CheckboxInput';
import UserProfileDeliveryPageSkeleton from './UserProfilePaymentPageSkeleton';

import { selectAdvertsDetails } from '../../redux/addAdverts/selectors';
import { setField } from '../../redux/addAdverts/slice';
import { deliveryType } from '../../utils/cartDetails';
import useDelayedLoading from '../../hooks/useDelayedLoading';

import css from './UserProfileDeliveryPage.module.css';

export default function UserProfileDeliveryPage() {
  const [editMode, setEditMode] = useState(false);

  const delayedLoading = useDelayedLoading();

  const dispatch = useDispatch();
  const { isSelectedDelivery } = useSelector(selectAdvertsDetails);

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

  if (delayedLoading) {
    return <UserProfileDeliveryPageSkeleton />;
  }

  return (
    <div className={css.container}>
      <div className={css.wrap}>
        <h2 className={css.title}>Спосіб доставки</h2>
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
            disabled={localSelection.length === 0}
          >
            Зберегти зміни
          </CustomButton>
        </form>
      ) : isSelectedDelivery?.length > 0 ? (
        <ul className={`${css.deliveryBox} ${css.box}`}>
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
          <div className={css.imageContainer}>
            <img
              src={deliveryType[0].img}
              alt={deliveryType[0].name}
              width={deliveryType[0].width}
              height={deliveryType[0].height}
              className={css.inactiveImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
