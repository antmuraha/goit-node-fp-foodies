import { useContext, type ReactElement } from "react";
import { useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useDataRecipe, useScrollToTop } from "../../shared/hooks";
import PopularRecipesList from "../../shared/ui/popular-recipes-list";
import RecipeIngredientsPanel from "../../features/recipe/ui/RecipeIngredientsPanel";
import RecipeInstructionsPanel from "../../features/recipe/ui/RecipeInstructionsPanel";
import { useUserFavorites } from "../../shared/helpers/useUserFavorites";
import { Button } from "../../shared/ui";
import { useAuth } from "../../shared/hooks";
import useIsOwnEntity from "../../shared/helpers/useIsOwnEntity";
import { AuthModalContext } from "../../shared/contexts/AuthModalContext";
import styles from "./RecipePage.module.css";

export const RecipePage = (): ReactElement => {
  useScrollToTop();
  const { isAuthenticated } = useAuth();
  const authModal = useContext(AuthModalContext);

  const { id } = useParams();
  const recipeId = useMemo(() => {
    const numericId = Number(id);
    return Number.isInteger(numericId) && numericId > 0 ? numericId : undefined;
  }, [id]);

  const { recipe, isLoading, error } = useDataRecipe(recipeId);
  const ownRecipe = useIsOwnEntity(recipe?.author.id);
  const { isFavorite, toggleFavorite, isPending } = useUserFavorites();

  const handleProtectedAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      authModal?.openSignIn();
      return;
    }

    action();
  };

  const handleActionClick = (e: React.MouseEvent) => {
    if (!recipe) return;
    handleProtectedAction(e, () => {
      void toggleFavorite(recipe.id);
    });
  };

  return (
    <>
      <main className={styles.page}>
        {isLoading && <p className={styles.state}>Loading recipe...</p>}
        {error && <p className={styles.state}>Recipe error: {error}</p>}
        {!isLoading && !error && recipe && (
          <section className={styles.content}>
            {/* Left column: recipe image */}
            <div className={styles.imageWrapper}>
              <img className={styles.image} src={recipe.image ?? recipe.thumbnail ?? undefined} alt={recipe.title} />
            </div>

            {/* Right column: all recipe details */}
            <div className={styles.details}>
              {/* Title, tags, description, author */}
              <div className={styles.header}>
                <h1 className={styles.title}>{recipe.title}</h1>

                <div className={styles.tags}>
                  <span className={styles.tag}>{recipe.category.name}</span>
                  <span className={styles.tag}>{recipe.cookingTime} min</span>
                </div>

                <p className={styles.description}>{recipe.description ?? "No description yet"}</p>

                <NavLink className={styles.author} to={`/user/${recipe.author.id}`}>
                  {recipe.author.avatar ? (
                    <img className={styles.authorAvatar} src={recipe.author.avatar} alt={recipe.author.name} />
                  ) : (
                    <div className={styles.authorAvatar} aria-hidden="true" />
                  )}
                  <div className={styles.authorMeta}>
                    <span className={styles.authorLabel}>Created by:</span>
                    <span className={styles.authorName}>{recipe.author.name}</span>
                  </div>
                </NavLink>
              </div>

              {/* Ingredients */}
              <RecipeIngredientsPanel ingredients={recipe.ingredients} />

              {/* Instructions */}
              <RecipeInstructionsPanel instructions={recipe.instructions} />

              {/* Actions */}
              <div className={styles.actions}>
                <Button variant="secondary" disabled={isPending(recipe.id)} onClick={handleActionClick}>
                  {isFavorite(recipe.id) ? "Remove from Favorites" : "Add to Favorites"}
                </Button>

                {ownRecipe && <NavLink to={`/recipe/${recipe.id}/edit`}>Edit Recipe</NavLink>}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Popular recipes — outside the main, separate section with the top margin */}
      <div className={styles.popularSection}>
        <PopularRecipesList />
      </div>
    </>
  );
};
