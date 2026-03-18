import type { ReactElement } from "react";
import { useEffect, useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useDataRecipe } from "../../shared/hooks";
import PopularRecipesList from "../../shared/ui/popular-recipes-list";
import RecipeIngredientsPanel from "../../features/recipe/ui/RecipeIngredientsPanel";
import RecipeInstructionsPanel from "../../features/recipe/ui/RecipeInstructionsPanel";
import { useUserFavorites } from "../../shared/helpers/useUserFavorites";
import { Button } from "../../shared/ui";
import useIsOwnEntity from "../../shared/helpers/useIsOwnEntity";

export const RecipePage = (): ReactElement => {
  const { id } = useParams();
  const recipeId = useMemo(() => {
    const numericId = Number(id);
    return Number.isInteger(numericId) && numericId > 0 ? numericId : undefined;
  }, [id]);

  const { recipe, isLoading, error } = useDataRecipe(recipeId);
  const ownRecipe = useIsOwnEntity(recipe?.author.id);
  const { isFavorite, toggleFavorite, isPending, ensureFavoriteStatus } = useUserFavorites();

  useEffect(() => {
    if (recipeId) {
      void ensureFavoriteStatus(recipeId);
    }
  }, [recipeId, ensureFavoriteStatus]);

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
            <Button
              disabled={isPending(recipe.id)}
              onClick={() => {
                void toggleFavorite(recipe.id);
              }}
            >
              {isFavorite(recipe.id) ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
            {ownRecipe && <NavLink to={`/recipe/${recipe.id}/edit`}>Edit Recipe</NavLink>}
            <p>{recipe.description ?? "No description yet"}</p>
            <NavLink to={`/user/${recipe.author.id}`}>Author: {recipe.author.name}</NavLink>
            <p>Cooking time: {recipe.cookingTime} minutes</p>
            <p>Category: {recipe.category.name}</p>

            <RecipeIngredientsPanel ingredients={recipe.ingredients} />
            <RecipeInstructionsPanel instructions={recipe.instructions} />
          </section>
        )}
      </main>
      <PopularRecipesList />
    </>
  );
};
