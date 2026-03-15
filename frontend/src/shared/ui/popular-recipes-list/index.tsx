import { useDataPopularRecipes } from "../../hooks/useDataPopularRecipes";

const PopularRecipesList = () => {
  const { recipes } = useDataPopularRecipes();
  console.log("PopularRecipesList recipes:", recipes);
  return (
    <div>
      <h2>Popular Recipes</h2>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
        </div>
      ))}
    </div>
  );
};

export default PopularRecipesList;
