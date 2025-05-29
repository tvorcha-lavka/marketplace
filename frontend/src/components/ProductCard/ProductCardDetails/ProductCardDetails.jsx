import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams, useLocation, useNavigate } from 'react-router-dom';

import RecommendedCards from '../../RecommendedCards/RecommendedCards';
import BasketModal from '../BasketModal/BasketModal';
import BasketDetailsModal from '../BasketDetailsModal/BasketDetailsModal';
import CardDetailsGallery from '../CardDetailsGallery/CardDetailsGallery';
import CardDetailsDescription from '../CardDetailsDescription/CardDetailsDescription';
import ModalBtnCross from '../../ModalBtnCross/ModalBtnCross';
import ProductDetailsInfo from '../ProductDetailsInfo/ProductDetailsInfo';
import Loader from '../../../formModalComponents/Loader/Loader';
import Owner from '../Owner/Owner';
import Delivery from '../Delivery/Delivery';
import Payment from '../Payment/Payment';

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

  const { id: cardId, categoryId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const product = useSelector(selectProductDetails);
  const isLoading = useSelector(selectLoading);
  const category = useSelector(selectCategoryById);

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

  const openModalDetails = (e) => {
    e.preventDefault();
    closeModal();
    setIsOpenBasketDetailsModal(true);
  };

  const closeModalDetails = () => {
    setIsOpenBasketDetailsModal(false);
  };

  const modalRef = useClickEsc(closeModal);

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
              {location.state?.from === 'main' && (
                <li>
                  <NavLink to="/" className={css.pathItem}>
                    Головна /&nbsp;
                  </NavLink>
                </li>
              )}

              {location.state?.from === 'categories' && (
                <li>
                  <NavLink
                    className={css.pathItem}
                    to={`/categories/${categoryId}`}
                  >
                    {category?.title} /&nbsp;
                  </NavLink>
                </li>
              )}

              {location.state?.from === 'recommended' && (
                <>
                  {location.state?.prevFrom === 'main' && (
                    <li>
                      <NavLink to="/" className={css.pathItem}>
                        Головна /&nbsp;
                      </NavLink>
                    </li>
                  )}

                  {location.state?.prevFrom === 'categories' && (
                    <li>
                      <NavLink
                        to={`/categories/${categoryId}`}
                        className={css.pathItem}
                      >
                        {category?.title} /&nbsp;
                      </NavLink>
                    </li>
                  )}

                  {location.state?.prevFrom === 'recommended' && (
                    <>
                      <li>
                        <NavLink to="/" className={css.pathItem}>
                          Головна /&nbsp;
                        </NavLink>
                      </li>
                      <li>
                        <button
                          onClick={() => navigate(-1)}
                          className={`${css.backButton} ${css.pathItem}`}
                        >
                          Повернутись назад /&nbsp;
                        </button>
                      </li>
                    </>
                  )}

                  {location.state?.from === 'search' && (
                    <li>
                      <NavLink to="/" className={css.pathItem}>
                        Пошук /&nbsp;
                      </NavLink>
                    </li>
                  )}
                </>
              )}

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
                  <Owner product={product} />
                </div>

                <div className={css.delivery}>
                  <Delivery />
                </div>

                <div className={css.paymentInfo}>
                  <Payment />
                </div>
              </div>
            </div>

            <RecommendedCards title="Вам також може сподобатись:" />
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
