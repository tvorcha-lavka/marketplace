import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

import RecommendedCards from '../../RecommendedCards/RecommendedCards';
import BasketModal from '../BasketModal/BasketModal';
import BasketDetailsModal from '../BasketDetailsModal/BasketDetailsModal';
import CardDetailsGallery from '../CardDetailsGallery/CardDetailsGallery';
import CardDetailsDescription from '../CardDetailsDescription/CardDetailsDescription';
import ModalBtnCross from '../../ModalBtnCross/ModalBtnCross';
import ProductDetailsInfo from '../ProductDetailsInfo/ProductDetailsInfo';
import Loader from '../../../formModalComponents/Loader/Loader';

import { stars } from './details';
import { media } from '../../../utils/mediaConfig';
import { useClickEsc } from '../../../hooks/useClickEsc';
import useNoScroll from '../../../hooks/useNoScroll';
import { getProductsId } from '../../../redux/products/operations';
import {
  selectProductDetails,
  selectLoading,
} from '../../../redux/products/selectors';
import { selectCategoryById } from '../../../redux/categories/categoriesSelectors';

import css from './ProductCardDetails.module.css';

export default function ProductCardDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenBasketDetailsModal, setIsOpenBasketDetailsModal] =
    useState(false);

  const { cardId } = useParams();
  const dispatch = useDispatch();

  const product = useSelector(selectProductDetails);
  const category = useSelector(selectCategoryById);
  const categoryId = category?.id;
  const isLoading = useSelector(selectLoading);

  useEffect(() => {
    if (cardId) {
      dispatch(getProductsId(cardId));
    }
  }, [dispatch, cardId]);

  useNoScroll(isModalOpen);
  useNoScroll(isOpenBasketDetailsModal);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModalDetails = () => {
    closeModal();
    setIsOpenBasketDetailsModal(true);
  };

  const closeModalDetails = () => {
    setIsOpenBasketDetailsModal(false);
  };

  const modalRef = useClickEsc(closeModal);

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'eeee, d MMMM yyyy, HH:mm:ss', { locale: uk });
  };

  return (
    <>
      {isLoading ? (
        <div className={css.loader}>
          <Loader />
        </div>
      ) : (
        product && (
          <section>
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
                <ProductDetailsInfo onClick={openModal} product={product} />

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
                        <p className={css.paymentText}>
                          Безпечна оплата карткою
                        </p>
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
        )
      )}

      {isModalOpen && (
        <div className={css.modalBackdrop}>
          <div className={css.modalContent} ref={modalRef}>
            <BasketModal
              product={product}
              onClose={closeModal}
              onOpenDetails={openModalDetails}
            />
            <ModalBtnCross onClick={closeModal} />
          </div>
        </div>
      )}

      {isOpenBasketDetailsModal && (
        <div className={css.modalBackdrop}>
          <div className={css.modalBasketContent} ref={modalRef}>
            <BasketDetailsModal />
            <ModalBtnCross onClick={closeModalDetails} />
          </div>
        </div>
      )}
    </>
  );
}
