import type { ReactElement } from "react";
import { useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useDataRecipe } from "../../shared/hooks";
import PopularRecipesList from "../../shared/ui/popular-recipes-list";
import RecipeIngredientsPanel from "../../features/recipe/ui/RecipeIngredientsPanel";
import RecipeInstructionsPanel from "../../features/recipe/ui/RecipeInstructionsPanel";

export const RecipePage = (): ReactElement => {
  const { id } = useParams();
  const recipeId = useMemo(() => {
    const numericId = Number(id);
    return Number.isInteger(numericId) && numericId > 0 ? numericId : undefined;
  }, [id]);

  const { recipe, isLoading, error } = useDataRecipe(recipeId);

  return (
    <>
      <main>
        <h1>Recipe page</h1>
        {isLoading && <p>Loading recipe...</p>}
        {error && <p>Recipe error: {error}</p>}
        {!isLoading && !error && recipe && (
          <section>
            <h2>{recipe.title}</h2>
            <img src={recipe.image ?? recipe.thumbnail ?? undefined} alt={recipe.title} width={300} />
            <p>{recipe.description ?? "No description yet"}</p>
            <NavLink to={`/user/${recipe.author.id}`}>Author: {recipe.author.name}</NavLink>
            <p>Cooking time: {recipe.cookingTime} minutes</p>
            <p>Category: {recipe.Category.name}</p>

            <RecipeIngredientsPanel ingredients={recipe.Ingredients} />
            <RecipeInstructionsPanel instructions={recipe.instructions} />
          </section>
        )}
      </main>
      <PopularRecipesList />
    </>
  );
};
