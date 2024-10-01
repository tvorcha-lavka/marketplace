import styles from './CatalogModal.module.css';
import { GoChevronRight } from 'react-icons/go';
import {useDispatch, useSelector} from 'react-redux'
import fotoAlternate from '../../images/not-found.png';
import { selectCategories, selectIsLoading, selectError } from '../../redux/categories/categoriesSelectors';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllCategories } from '../../redux/categories/categoriesOperations';


export default function CatalogModal() {
  const [focusId, setFocusId] = useState(null);

  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError)
  
  console.log(categories)
  
   const focusedCategory = categories.find((_, index) => index === focusId);
  const subcategories = focusedCategory?.children || [];

    useEffect(() => {
      // console.log(dispatch(getAllCategories()))
      dispatch(getAllCategories());
    }, [dispatch])
  
  const handleMouseEnter = (id) => {
    setFocusId(id);
  };

  const handleMouseLeave = () => {
    setFocusId(null); 
  };

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;

 return (
   <div className={styles.modal_box} onMouseLeave={handleMouseLeave}>
     <div
       className={
         focusId !== null && subcategories.length > 0
           ? `${styles.box_categories_open}`
           : `${styles.box_categories}`
       }
     >
       <ul
         className={
           focusId !== null
             ? `${styles.list_categories_open}`
             : `${styles.list_categories}`
         }
       >
         {categories?.map((category, id) => (
           <li key={id} className={styles.category_item}>
             <Link
               className={styles.category}
               onMouseEnter={() => handleMouseEnter(id)}
             >
               {category.title}
               {category.children && category.children.length > 0 && (
                 <GoChevronRight className={styles.icon_right} />
               )}
             </Link>
           </li>
         ))}
       </ul>
     </div>
     {focusId !== null && subcategories.length > 0 && (
       <div className={styles.category_menu} 
         >
         <div className={styles.scrollbox}>
           <div className={styles.scrollbox_inner}>
             <ul className={styles.list_cards}>
               {subcategories.map((item, index) => (
                 <li key={index} className={styles.item_card}>
                   <h2 className={styles.list_title}>
                     {focusedCategory.title}
                   </h2>
                   <img
                     src={item.url ? `${item.url}` : fotoAlternate}
                     alt={item.title}
                     className={styles.item_img}
                   />
                   <div className={styles.box_text}>
                     <p className={styles.ttitle}>{item.title}</p>
                   </div>
                 </li>
               ))}
             </ul>
           </div>
         </div>
       </div>
     )}
   </div>
 );
}
