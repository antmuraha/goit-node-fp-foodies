import { type ReactElement, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../../shared/ui/recipe-card";
import { useDataRecipes } from "../../shared/hooks";
import { Pagination } from "../../shared/ui";
import styles from "./CategoryRecipesGrid.module.css";

const PAGE_LIMIT = 9;

interface CategoryRecipesGridProps {
  categoryId: number;
}

export function CategoryRecipesGrid({ categoryId }: CategoryRecipesGridProps): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const ingredientId = searchParams.get("ingredientId") ? Number(searchParams.get("ingredientId")) : undefined;
  const areaId = searchParams.get("areaId") ? Number(searchParams.get("areaId")) : undefined;

  const { recipes, total, isLoading, error, loadRecipes } = useDataRecipes({
    categoryId,
    ingredientId,
    areaId,
    limit: PAGE_LIMIT,
    offset: (page - 1) * PAGE_LIMIT,
  });
  const totalPages = useMemo(() => Math.ceil((total ?? 0) / PAGE_LIMIT), [total]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        prev.set("page", String(newPage));
        return prev;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (typeof loadRecipes === "function") {
      loadRecipes();
    }
  }, [page, categoryId, ingredientId, areaId]);

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
  }, [ingredientId, areaId]);

  if (isLoading && (recipes?.length === 0 || !recipes)) {
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

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />}
    </div>
  );
}
