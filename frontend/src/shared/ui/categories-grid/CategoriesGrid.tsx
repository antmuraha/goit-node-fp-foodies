import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useDataCategories } from "../../hooks/useDataCategories";
import { CategoryCard } from "../../../features/categories/category-card";
import styles from "./CategoriesGrid.module.css";

const CATEGORIES_DESCRIPTION =
  "Discover a limitless world of culinary possibilities and enjoy exquisite recipes that combine taste, style and the warm atmosphere of the kitchen.";

const CategoriesGrid = (): ReactElement => {
  const { categories, isLoading, error } = useDataCategories();

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Categories</h2>
        <p className={styles.description}>{CATEGORIES_DESCRIPTION}</p>
      </div>

      <div className={styles.list} role="list">
        {isLoading && <p className={styles.statusMessage}>Loading categories…</p>}

        {!isLoading && error && <p className={styles.statusMessage}>{error}</p>}

        {!isLoading &&
          !error &&
          categories.map((category) => (
            <div key={category.id} role="listitem">
              <CategoryCard id={category.id} name={category.name} image={category.image} />
            </div>
          ))}

        {!isLoading && !error && categories.length > 0 && (
          <Link to="/" className={styles.allCard} aria-label="Browse all categories">
            <span className={styles.allCardLabel}>All categories</span>
          </Link>
        )}
      </div>
    </section>
  );
};

export default CategoriesGrid;
