import type { RootState } from "../store";

const toRecipeKey = (recipeId: number | string): string => String(recipeId);

export const selectFavoriteStatusCache = (state: RootState) => state.favorites.favoriteStatusByRecipeId;

export const selectFavoriteStatusRequestState = (state: RootState, recipeId: number | string) =>
  state.favorites.favoriteStatusRequestByRecipeId[toRecipeKey(recipeId)] ?? "idle";

export const selectIsFavoriteFromList = (state: RootState, recipeId: number | string): boolean | undefined => {
  const isFavorite = state.recipes.favoriteRecipes.data.some(
    (recipe) => toRecipeKey(recipe.id) === toRecipeKey(recipeId),
  );

  return isFavorite ? true : undefined;
};

export const selectIsFavoriteFromCache = (state: RootState, recipeId: number | string): boolean | undefined =>
  state.favorites.favoriteStatusByRecipeId[toRecipeKey(recipeId)];

export const selectResolvedIsFavorite = (state: RootState, recipeId: number | string): boolean | undefined => {
  const listStatus = selectIsFavoriteFromList(state, recipeId);

  if (typeof listStatus === "boolean") {
    return listStatus;
  }

  return selectIsFavoriteFromCache(state, recipeId);
};
