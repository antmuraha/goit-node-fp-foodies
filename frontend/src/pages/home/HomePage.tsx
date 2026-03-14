import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useDataRecipes } from "../../shared/hooks";
import { APP_ROUTES } from "../../shared/constants/routes";
import { CategoriesGrid } from "../../shared/ui/categories-grid";

const TEMP_ROUTE_LINKS = [
  { label: "Home", path: APP_ROUTES.HOME },
  { label: "UI Kit", path: APP_ROUTES.UI_KIT },
  { label: "Sign in", path: APP_ROUTES.SIGN_IN },
  { label: "Recipe details (id: 1)", path: "/recipe/1" },
  { label: "Add recipe", path: APP_ROUTES.RECIPE_ADD },
  { label: "User profile (id: 1)", path: "/user/1" },
  { label: "Not found", path: APP_ROUTES.NOT_FOUND },
] as const;

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
      <section>
        <h2>Temporary routes</h2>
        <ul>
          {TEMP_ROUTE_LINKS.map((routeLink) => (
            <li key={routeLink.path}>
              <Link to={routeLink.path}>{routeLink.label}</Link>
            </li>
          ))}
        </ul>
      </section>
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
      <CategoriesGrid />
    </main>
  );
};
