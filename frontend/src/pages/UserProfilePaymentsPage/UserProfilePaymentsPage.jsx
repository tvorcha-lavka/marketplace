import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlusCircle } from 'react-icons/fi';
import { LuTrash } from 'react-icons/lu';

import ToggleButton from '../../components/ButtonElements/ToggleButton/ToggleButton';
import UserProfilePaymentModal from '../../components/UserProfilePaymentModal/UserProfilePaymentModal';
import ModalBtnCross from '../../components/ButtonElements/ModalBtnCross/ModalBtnCross';
import UserProfilePaymentPageSkeleton from './UserProfilePaymentPageSkeleton';

import { media } from '../../utils/mediaConfig';
import useNoScroll from '../../hooks/useNoScroll';
import { useClickEsc } from '../../hooks/useClickEsc';
import {
  addCard,
  deleteCard,
  setMainCardIndex,
  toggleShowHidden,
} from '../../redux/paymentUserCards/slice';
import {
  selectCards,
  selectMainCardIndex,
} from '../../redux/paymentUserCards/selectors';
import useDelayedLoading from '../../hooks/useDelayedLoading';

import css from './UserProfilePaymentsPage.module.css';

const CARD_IMAGES = {
  visa: `${media}/profile/Visa.png`,
  mastercard: `${media}/profile/Mastercard.png`,
};

export default function UserProfilePaymentsPage() {
  const [isOpenAddCardModal, setIsOpenAddCardModal] = useState(false);

  const delayedLoading = useDelayedLoading();

  const dispatch = useDispatch();

  const cards = useSelector(selectCards);
  const mainCardIndex = useSelector(selectMainCardIndex);

  const detectCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    return 'unknown';
  };

  const formatCardNumber = (number, showHidden, onToggle) => {
    const digits = number.replace(/\s/g, '');
    if (digits.length !== 16) return number;

    const parts = digits.match(/.{1,4}/g);

    return (
      <>
        {parts[0]}{' '}
        <span
          className={css.maskedDigits}
          onClick={onToggle}
          title={showHidden ? 'Сховати' : 'Показати'}
        >
          {showHidden ? `${parts[1]} ${parts[2]}` : '**** ****'}
        </span>{' '}
        {parts[3]}
      </>
    );
  };

  const handleDeleteCard = (index) => {
    dispatch(deleteCard(index));
    if (mainCardIndex === index) {
      dispatch(setMainCardIndex(null));
    } else if (mainCardIndex > index) {
      dispatch(setMainCardIndex(mainCardIndex - 1));
    }
  };

  const handleToggleShowHidden = (index) => {
    dispatch(toggleShowHidden(index));
  };

  useNoScroll(isOpenAddCardModal);

  const modalRef = useClickEsc(() => setIsOpenAddCardModal(false));

  if (delayedLoading) {
    return <UserProfilePaymentPageSkeleton />;
  }

  return (
    <div className={css.container}>
      <h2 className={css.title}>Платіжні карти</h2>

      <ul className={css.cardList}>
        {cards.map((card, index) => {
          const type = detectCardType(card.card_number);
          const imgSrc = CARD_IMAGES[type];

          return (
            <li className={css.cardItem} key={index}>
              <div className={css.wrapCardNumber}>
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={`${type} logo`}
                    className={css.cardLogo}
                    width={48}
                    height={32}
                  />
                )}
                <div>
                  <p className={css.cardNumber}>
                    {formatCardNumber(
                      card.card_number,
                      card.showHiddenDigits,
                      () => handleToggleShowHidden(index)
                    )}
                  </p>
                  <p className={css.cardExpire}>{card.card_expire}</p>
                </div>
              </div>

              <div className={css.btnWrap}>
                <div className={css.toggleWrap}>
                  <ToggleButton
                    label="Основна картка"
                    onClick={() =>
                      dispatch(
                        setMainCardIndex(mainCardIndex === index ? null : index)
                      )
                    }
                    isSwitchActive={mainCardIndex === index}
                    owner={index}
                  />
                </div>
                <button
                  className={css.deleteCard}
                  onClick={() => handleDeleteCard(index)}
                  aria-label="Видалити картку"
                >
                  <LuTrash className={css.deleteCardIcon} />
                </button>
              </div>
            </li>
          );
        })}

        <li
          className={css.cardItemAdd}
          onClick={() => setIsOpenAddCardModal(true)}
        >
          <FiPlusCircle className={css.iconAdd} />
          <p className={css.textCardAdd}>Додайте платіжну карту</p>
        </li>
      </ul>

      {isOpenAddCardModal && (
        <div className={css.modalBackdrop}>
          <div className={css.modalContent} ref={modalRef}>
            <UserProfilePaymentModal
              onSubmit={(card) => {
                const { card_cvv: _unused, ...rest } = card; // eslint-disable-line no-unused-vars
                dispatch(addCard({ ...rest, showHiddenDigits: false }));
                if (card.isMain) {
                  dispatch(setMainCardIndex(cards.length));
                }
                setIsOpenAddCardModal(false);
              }}
            />
            <ModalBtnCross onClick={() => setIsOpenAddCardModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
