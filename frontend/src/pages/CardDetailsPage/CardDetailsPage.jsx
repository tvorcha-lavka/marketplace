import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { RxCross2 } from 'react-icons/rx';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

import RecommendedCards from '../../components/RecommendedCards/RecommendedCards';
import BasketModal from '../../components/BasketModal/BasketModal';
import CardDetailsGallery from '../../components/CardDetailsGallery/CardDetailsGallery';
import CardDetailsDescription from '../../components/CardDetailsDescription/CardDetailsDescription';
import CustomButton from '../../components/CustomButton/CustomButton';

import { stars } from './details';
import { media } from '../../utils/mediaConfig';
import { useClickEsc } from '../../hooks/useClickEsc';
import useNoScroll from '../../hooks/useNoScroll';
import { getProductsId } from '../../redux/products/operations';
import { selectProductDetails } from '../../redux/products/selectors';
import { selectCategoryById } from '../../redux/categories/categoriesSelectors';

import css from './CardDetailsPage.module.css';

export default function CardDetailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { cardId } = useParams();

  const dispatch = useDispatch();

  const product = useSelector(selectProductDetails);
  const category = useSelector(selectCategoryById);
  const categoryId = category?.id;

  useEffect(() => {
    if (cardId) {
      dispatch(getProductsId(cardId));
    }
  }, [dispatch, cardId]);

  useNoScroll(isModalOpen);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const modalRef = useClickEsc(closeModal);

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'eeee, d MMMM yyyy, HH:mm:ss', { locale: uk });
  };

  return (
    <>
      {product && (
        <section className={css.section}>
          <ul className={css.pathList}>
            <li>
              <NavLink
                className={css.pathItem}
                to={`/categories/${categoryId}`}
              >
                {category?.title}/&nbsp;
              </NavLink>
            </li>
            <li>
              <NavLink
                className={`${css.active} ${css.pathItem}`}
                to={`/cards/${cardId}`}
              >
                {product?.title}
              </NavLink>
            </li>
          </ul>

          <div className={css.container}>
            <div className={css.galleryContainer}>
              <CardDetailsGallery product={product} />

              <CardDetailsDescription product={product} />
            </div>

            <div className={css.productDetails}>
              <div className={css.orderInfo}>
                <p className={css.publicDate}>
                  Опубліковано&nbsp;{product.date_published}
                </p>
                <h1 className={css.cartTitle}>{product.title}</h1>
                <p className={css.price}>{product.price}&nbsp;грн.</p>
                <CustomButton size="large" className={css.deliveryBtn}>
                  Замовити з доставкою
                </CustomButton>
                <CustomButton
                  size="large"
                  variant="another"
                  onClick={openModal}
                  className={css.basketBtn}
                >
                  Додати до кошика
                </CustomButton>
              </div>

              <div className={css.sellerInfo}>
                <img
                  className={css.avatar}
                  src={`${media}/page/404/not-found.png`}
                  width="80"
                  height="80"
                  alt={product.owner.username}
                />

                <div>
                  <div className={css.seller}>
                    <p className={css.sellerName}>{product.owner.username}</p>

                    <div className={css.reviewsBox}>
                      {stars.map((star) => (
                        <ul key={star.id} className={css.starsList}>
                          <li className={css.star}>
                            <span className={css.iconStar}>{star.image}</span>
                          </li>
                        </ul>
                      ))}
                      <p className={css.reviews}>(0 відгуків)</p>
                    </div>

                    <p className={css.startStore}>
                      на Tvorcha Lavka з&nbsp;
                      {formatDate(product.owner.date_joined)}
                    </p>
                    <p className={css.sellerOnline}>
                      Онлайн в&nbsp;{formatDate(product.owner.last_active)}
                    </p>
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

          <RecommendedCards />
        </section>
      )}

      {isModalOpen && (
        <div className={css.modalBackdrop}>
          <div className={css.modalContent} ref={modalRef}>
            <BasketModal product={product} />
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
