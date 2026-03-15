import { type ReactElement, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDataRecipes } from "../../shared/hooks";
import RecipeCard from "../../shared/ui/recipe-card";

export const CategoryPage = (): ReactElement => {
  const { id: categoryId } = useParams();
  console.log({ categoryId });
  const { recipes, isLoading, error, loadRecipes } = useDataRecipes({ categoryId: Number(categoryId) });

  useEffect(() => {
    loadRecipes();
  }, []);

  return (
    <>
      <header>
        <h1>Category page</h1>
      </header>
      <main>
        <aside>
          <h2>Category filters</h2>
          <p>Here you can place category filters, sorting options, or a list of subcategories.</p>
        </aside>
        <section>
          {isLoading && <p>Loading category...</p>}
          {error && <p>Category error: {error}</p>}
          {!isLoading && !error && recipes.map((recipe) => <RecipeCard key={recipe.id} {...recipe} />)}
        </section>
      </main>
    </>
  );
};
