import { ReactElement } from "react";
import { useDataPopularRecipes } from "../../hooks/useDataPopularRecipes";
import RecipeCard from "../recipe-card/index";
import styles from "./PopularRecipesList.module.css";

const PopularRecipesList = (): ReactElement => {
  const { recipes } = useDataPopularRecipes({ limit: 4 });

  if (!recipes || recipes.length === 0) {
    return <div className={styles.loader}>Loading...</div>;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Popular Recipes</h2>
      <div className={styles.grid}>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            description={recipe.description}
            image={recipe.image}
            thumbnail={recipe.thumbnail}
            author={recipe.author}
            variant="grid"
          />
        ))}
      </div>
    </section>
  );
};

export default PopularRecipesList;
