import type { ReactElement } from "react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDataRecipe } from "../../shared/hooks";

export const RecipePage = (): ReactElement => {
  const { id } = useParams();
  const recipeId = useMemo(() => {
    const numericId = Number(id);
    return Number.isInteger(numericId) && numericId > 0 ? numericId : undefined;
  }, [id]);

  const { recipe, isLoading, error } = useDataRecipe(recipeId);

  return (
    <main>
      <h1>Recipe page</h1>
      {isLoading && <p>Loading recipe...</p>}
      {error && <p>Recipe error: {error}</p>}
      {!isLoading && !error && recipe && (
        <section>
          <h2>{recipe.name}</h2>
          <p>{recipe.description ?? "No description yet"}</p>
          {recipe.author && <p>Author: {recipe.author.name}</p>}
        </section>
      )}
    </main>
  );
};
