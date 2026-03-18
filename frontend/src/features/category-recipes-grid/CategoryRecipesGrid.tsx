import { type ReactElement, useEffect, useRef } from "react";
// Resolved merge conflict: kept useDataRecipes pattern per team lead review
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../../shared/ui/recipe-card";
import { useDataRecipes } from "../../shared/hooks";
import styles from "./CategoryRecipesGrid.module.css";

const PAGE_LIMIT = 9;

interface CategoryRecipesGridProps {
  categoryId: number;
  /**
   * TODO: FE-CATEGORY-03
   * When pagination component is ready, pass it here as a slot.
   * The grid already tracks ?page=N from URL and converts it to offset.
   * Pagination component just needs to update ?page param in URL.
   * Example:
   *   <CategoryRecipesGrid categoryId={id} pagination={<Pagination />} />
   */
  pagination?: ReactElement;
}

export function CategoryRecipesGrid({ categoryId, pagination }: CategoryRecipesGridProps): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const ingredientId = searchParams.get("ingredientId") ? Number(searchParams.get("ingredientId")) : undefined;
  const areaId = searchParams.get("areaId") ? Number(searchParams.get("areaId")) : undefined;

  const { recipes, isLoading, error } = useDataRecipes({
    categoryId,
    ingredientId,
    areaId,
    limit: PAGE_LIMIT,
    offset: (page - 1) * PAGE_LIMIT,
  });

  // Reset to page 1 when filters change (skip on first render)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSearchParams(
      (prev) => {
        prev.set("page", "1");
        return prev;
      },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredientId, areaId]);

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <ul className={styles.grid} aria-busy="true" aria-label="Loading recipes">
          {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
            <li key={i}>
              <div className={styles.skeleton} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.state} role="alert">
        {error}
      </div>
    );
  }

  if (!isLoading && recipes.length === 0) {
    return <div className={styles.state}>No recipes found for the selected filters.</div>;
  }

  return (
    <div className={styles.wrapper}>
      <ul className={styles.grid} role="list">
        {recipes.map((recipe) => (
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

      {/* TODO: FE-CATEGORY-03 — render pagination slot once ready */}
      {pagination}
    </div>
  );
}
