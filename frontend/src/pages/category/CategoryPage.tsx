import { type ReactElement } from "react";
import { useParams } from "react-router-dom";
import { CategoryRecipesGrid } from "../../features/category-recipes-grid";
import { CategoryFilterPanel } from "../../features/category-filters";
import styles from "./CategoryPage.module.css";

export const CategoryPage = (): ReactElement => {
  const { id: categoryId } = useParams();

  return (
    <>
      <header>
        <h1>Category page</h1>
      </header>
      <main className={styles.main}>
        <aside className={styles.aside}>
          <CategoryFilterPanel />
        </aside>
        <section className={styles.section}>
          <CategoryRecipesGrid categoryId={Number(categoryId)} />
        </section>
      </main>
    </>
  );
};
