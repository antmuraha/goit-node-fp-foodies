import type { ReactElement } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../shared/hooks";
import { Icon } from "../../shared/components/Icon";
import { CategoryFilterPanel } from "../category-filters";
import { CategoryRecipesGrid } from "../category-recipes-grid";
import styles from "./CategorySection.module.css";

interface CategorySectionProps {
  categoryId: number;
}

export function CategorySection({ categoryId }: CategorySectionProps): ReactElement {
  const [, setSearchParams] = useSearchParams();

  const category = useAppSelector((state) => state.categories.list.find((c) => c.id === categoryId));

  const handleBack = (): void => {
    setSearchParams({});
  };

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <button type="button" className={styles.backBtn} onClick={handleBack} aria-label="Back to categories">
          <Icon name="arrow-up-right" color="color-main" size={18} />
          <span>Back</span>
        </button>

        <h2 className={styles.title}>{category?.name ?? "Category"}</h2>
      </div>

      <div className={styles.content}>
        <aside className={styles.aside}>
          <CategoryFilterPanel />
        </aside>

        <div className={styles.grid}>
          <CategoryRecipesGrid categoryId={categoryId} />
        </div>
      </div>
    </section>
  );
}
