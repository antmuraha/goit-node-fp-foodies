import { type ReactElement } from "react";
import RecipeCard from "../../shared/ui/recipe-card";
import { Pagination } from "../../shared/ui";
import styles from "./CategoryRecipesGrid.module.css";
import { RecipeSummary } from "../../entities/recipe/types";

interface CategoryRecipesGridProps {
  list: RecipeSummary[];
  totalPages: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

export function CategoryRecipesGrid({
  list,
  totalPages,
  currentPage,
  onPageChange,
}: CategoryRecipesGridProps): ReactElement {
  return (
    <div className={styles.wrapper}>
      <ul className={styles.grid} role="list">
        {list.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              image={recipe.image}
              thumbnail={recipe.thumbnail}
              author={recipe.author}
              variant="grid"
            />
          </li>
        ))}
      </ul>

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />}
    </div>
  );
}
