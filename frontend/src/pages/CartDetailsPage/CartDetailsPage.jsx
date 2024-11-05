import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { RxCross2 } from 'react-icons/rx';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';

import RecommendedCarts from '../../components/RecommendedCarts/RecommendedCarts';
import BasketModal from '../../components/BasketModal/BasketModal';

import { details } from './details';
import { media } from '../../utils/mediaConfig';
import { useClickEsc } from '../../hooks/useClickEsc';
import useNoScroll from '../../hooks/useNoScroll';

import css from './CartDetailsPage.module.css';

const stars = [
  {
    id: 1,
    image: <FaStar />,
  },
  {
    id: 2,
    image: <FaStar />,
  },
  {
    id: 3,
    image: <FaStar />,
  },
  {
    id: 4,
    image: <FaStar />,
  },
  {
    id: 5,
    image: <FaStar />,
  },
];

export default function CartDetailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? details.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === details.length - 1 ? 0 : prevIndex + 1
    );
  };

  useNoScroll(isModalOpen);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const modalRef = useClickEsc(closeModal);

  return (
    <>
      <section className={css.section}>
        <ul className={css.pathList}>
          <li className={css.pathItem}>
            <p className={css.pathText}>
              Українське ремесло/ Ганчарство/&nbsp;
            </p>
          </li>
          <li className={css.pathItem}>
            <p className={css.pathText}>Для кухні</p>
          </li>
        </ul>

        <div className={css.container}>
          <div className={css.galleryContainer}>
            <div className={css.gallery}>
              <div className={css.galleryList}>
                {details.slice(1).map((card) => (
                  <ul key={card.id}>
                    <li className={css.galleryItem}>
                      <img
                        className={css.images}
                        src={card.img}
                        //alt={card.title}
                      />
                    </li>
                  </ul>
                ))}
              </div>

              <div>
                <div className={css.swiperContainer}>
                  <div className={css.swiper}>
                    <button className={css.prevBtn} onClick={prevSlide}>
                      <IoIosArrowBack className={css.arrowIcon} />
                    </button>
                    <img
                      className={css.image}
                      src={details[currentIndex].img}
                      //alt={card.title}
                    />
                    <button className={css.nextBtn} onClick={nextSlide}>
                      <IoIosArrowForward className={css.arrowIcon} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={css.description}>
              <h2 className={css.descriptionTitle}>Характеристики та опис</h2>
              <ul className={css.descriptionMenu}>
                <li className={css.descriptionText}>
                  Настоящий защитный льняной ангел-хранитель в традиции
                  изготовления кукол мотанка. Украинская этническая кукла. Эти
                  ангелы традиционно считались безликими, поскольку у них нет
                  характера. Они получают это только тогда, когда принадлежат
                  тому, кого призваны защищать
                </li>
                <li className={css.descriptionText}>
                  Настоящий защитный льняной ангел-хранитель в традиции
                  изготовления кукол мотанка.
                </li>
              </ul>
              <button type="button" className={css.descriptionBtn}>
                Докладніше
              </button>
            </div>
          </div>

          <div className={css.productDetails}>
            <div className={css.orderInfo}>
              <p className={css.publicDate}>Опубліковано 22 вересня 2024 р.</p>
              <h1 className={css.cartTitle}>
                Картина &#x201C;Залежний від сонця&#x201D; 50.8 &#x78; 60.9 см
              </h1>
              <p className={css.price}>1599 грн.</p>
              <button type="button" className={css.deliveryBtn}>
                Замовити з доставкою
              </button>
              <button
                type="button"
                onClick={openModal}
                className={css.basketBtn}
              >
                Додати до кошика
              </button>
            </div>

            <div className={css.sellerInfo}>
              <img
                className={css.avatar}
                src={details[3].img}
                width="80"
                height="80"
                alt="Seller avatar"
              />

              <div>
                <div className={css.seller}>
                  <p className={css.sellerName}>Марія Іванівна</p>

                  <div className={css.reviewsBox}>
                    {stars.map((star) => (
                      <ul key={star.id} className={css.starsList}>
                        <li className={css.star}>
                          <FaStar className={css.iconStar} />
                        </li>
                      </ul>
                    ))}
                    <p className={css.reviews}>(123 відгуки)</p>
                  </div>

                  <p className={css.startStore}>
                    на Tvorcha Lavka з вересня 2023 р.
                  </p>
                  <p className={css.sellerOnline}>Онлайн в 14.33</p>
                </div>

                <div className={css.startChat}>
                  <button type="button" className={css.chatBtn}>
                    Зв&#x2019;язатись з продавцем
                  </button>
                  <span className={css.pencilIcon}>
                    <HiOutlinePencilAlt />
                  </span>
                </div>
              </div>
            </div>

            <div className={css.delivery}>
              <h3 className={css.deliveryTitle}>Способи доставки</h3>
              <ul className={css.deliveryList}>
                <li className={css.deliveryItem}>
                  <img
                    className={css.novaPostLogo}
                    src={`${media}/logo/nova_post.svg`}
                    width="21"
                    height="21"
                    alt="NovaPost logotype"
                  />
                  <p className={css.deliveryPost}>Нова Пошта</p>
                </li>
                <li className={css.deliveryItem}>
                  <img
                    className={css.ukrPostLogo}
                    src={`${media}/logo/ukr_post.svg`}
                    width="21"
                    height="21"
                    alt="UkrPost logotype"
                  />
                  <p className={css.deliveryPost}>Укр Пошта</p>
                </li>
              </ul>
            </div>

            <div className={css.paymentInfo}>
              <h3 className={css.paymentTitle}>Оплата та гарантії</h3>
              <div className={css.payment}>
                <img
                  className={css.liqpayLogo}
                  src={`${media}/logo/logo_liqpay.svg`}
                  width="71"
                  height="22"
                  alt="Liqpay logotype"
                />
                <ol className={css.paymentList}>
                  <li className={css.paymentItem}>
                    <p className={css.paymentText}>Безпечна оплата карткою</p>
                  </li>
                  <li className={css.paymentItem}>
                    <p className={css.paymentText}>
                      Без передоплати - Tvorcha Lavka гарантує безпеку
                    </p>
                  </li>
                  <li className={css.paymentItem}>
                    <p className={css.paymentText}>
                      Повернемо гроші при відмові від посилки
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RecommendedCarts />

      {isModalOpen && (
        <div className={css.modalBackdrop}>
          <div className={css.modalContent} ref={modalRef}>
            <BasketModal />
            <button
              className={css.crossBtn}
              onClick={closeModal}
              aria-label="Close"
            >
              <RxCross2 className={css.crossIcon} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
