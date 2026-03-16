import type { ReactElement } from "react";
import { useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useDataRecipe } from "../../shared/hooks";
import type { RecipeIngredientDetails } from "../../entities/ingredient/types";
import PopularRecipesList from "../../shared/ui/popular-recipes-list";

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
            <h3>Ingredients:</h3>
            <ul>
              {recipe.Ingredients.map((ingredient: RecipeIngredientDetails) => (
                <li key={ingredient.id}>
                  {ingredient.name} -{" "}
                  {ingredient.image ? <img src={ingredient.image} alt={ingredient.name} width={50} /> : "No image"}
                  <br />
                  Quantity: {ingredient.RecipeIngredient.quantity} {ingredient.RecipeIngredient.unit ?? ""}
                </li>
              ))}
            </ul>
            <h3>Instructions:</h3>
            <p>{recipe.instructions}</p>
          </section>
        )}
      </main>
      <PopularRecipesList />
    </>
  );
};
