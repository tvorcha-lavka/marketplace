import React from 'react';
import styles from './CategoryPage.module.css'
import { useSelector } from 'react-redux';
import { selectCategories } from '../../redux/categories/categoriesSelectors';

function CategoryPage() {
    const categories = useSelector(selectCategories)

  return (
      <section className={styles.container} >CategoryPage</section>
  )
}

export default CategoryPage