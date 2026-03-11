import type { ReactElement } from "react";
import { useDataRecipes } from "../../shared/hooks";

export const HomePage = (): ReactElement => {
  const { recipes, isLoading, error } = useDataRecipes({ limit: 6, offset: 0 });

  return (
    <main className="token-demo-card">
      <p className="token-demo-kicker">Design system foundation</p>
      <h1 className="token-demo-title">Home page</h1>
      <p className="token-demo-text">
        This placeholder uses FE-UI-00 design tokens for typography, color, spacing, borders, and responsive type
        scaling.
      </p>
      <div className="token-chip-list" aria-label="Token demo chips">
        <span className="token-chip">primary action</span>
        <span className="token-chip token-chip--outlined">secondary action</span>
      </div>
      {isLoading && <p>Loading recipes...</p>}
      {error && <p>Recipes error: {error}</p>}
      {!isLoading && !error && recipes.length > 0 && (
        <section aria-label="Recent recipes">
          <h2>Recent recipes</h2>
          {recipes.map((recipe) => (
            <article key={recipe.id}>
              <h3>{recipe.name}</h3>
              <p>{recipe.description ?? "No description yet"}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};
