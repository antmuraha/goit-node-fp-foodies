import { useCallback, useState } from "react";
import { useStore } from "react-redux";
import type { RecipeSummary } from "../../entities/recipe/types";
import type { RootState } from "../../store/store";
import { FAVORITE_NOTIFICATIONS } from "../constants/notifications";
import { notificationService } from "../services/notifications";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { adjustFavoritesCount } from "../../store/slices/authSlice";
import { addFavoriteRecipe, optimisticFavoriteStatus, removeFavoriteRecipe } from "../../store/slices/favoritesSlice";
import {
  optimisticAddFavorite,
  optimisticRemoveFavorite,
  rollbackAddFavorite,
  rollbackRemoveFavorite,
} from "../../store/slices/recipesSlice";
import {
  selectFavoriteStatusCache,
  selectIsFavoriteFromCache,
  selectResolvedIsFavorite,
} from "../../store/slices/favoritesSelectors";

const toKey = (recipeId: number | string): string => String(recipeId);

export const useUserFavorites = () => {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const favoriteRecipes = useAppSelector((state) => state.recipes.favoriteRecipes.data);
  const recipesList = useAppSelector((state) => state.recipes.list);
  const popularList = useAppSelector((state) => state.recipes.popularList);
  const ownRecipes = useAppSelector((state) => state.recipes.ownRecipes.data);
  const selectedRecipe = useAppSelector((state) => state.recipes.selectedRecipe);
  const hasToken = useAppSelector((state) => Boolean(state.auth.token));

  const favoriteStatusCache = useAppSelector(selectFavoriteStatusCache);

  const [pendingRecipeIds, setPendingRecipeIds] = useState<Set<string>>(new Set());

  const getFavoriteStatus = useCallback(
    (recipeId: number | string): boolean | undefined => selectResolvedIsFavorite(store.getState(), recipeId),
    [store],
  );

  const isFavorite = useCallback(
    (recipeId: number | string): boolean => {
      const fromList = favoriteRecipes.some((recipe) => toKey(recipe.id) === toKey(recipeId));

      if (fromList) {
        return true;
      }

      return selectIsFavoriteFromCache(store.getState(), recipeId) ?? false;
    },
    // favoriteStatusCache subscription keeps card/detail UI in sync with profile hydration and optimistic updates
    [favoriteRecipes, favoriteStatusCache, store],
  );

  const isPending = useCallback(
    (recipeId: number | string): boolean => pendingRecipeIds.has(toKey(recipeId)),
    [pendingRecipeIds],
  );

  const findRecipeSummaryById = useCallback(
    (recipeId: number | string): RecipeSummary | null => {
      const fromFavorites = favoriteRecipes.find((r) => toKey(r.id) === toKey(recipeId));
      if (fromFavorites) return fromFavorites;

      const fromList = recipesList.find((r) => toKey(r.id) === toKey(recipeId));
      if (fromList) return fromList;

      const fromPopular = popularList.find((r) => toKey(r.id) === toKey(recipeId));
      if (fromPopular) return fromPopular;

      const fromOwn = ownRecipes.find((r) => toKey(r.id) === toKey(recipeId));
      if (fromOwn) return fromOwn;

      if (selectedRecipe && toKey(selectedRecipe.id) === toKey(recipeId)) {
        return selectedRecipe;
      }

      return null;
    },
    [favoriteRecipes, ownRecipes, popularList, recipesList, selectedRecipe],
  );

  const trackPendingRecipe = useCallback((recipeId: number | string) => {
    setPendingRecipeIds((prev) => {
      const next = new Set(prev);
      next.add(toKey(recipeId));
      return next;
    });
  }, []);

  const releasePendingRecipe = useCallback((recipeId: number | string) => {
    setPendingRecipeIds((prev) => {
      const next = new Set(prev);
      next.delete(toKey(recipeId));
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(
    async (recipeId: number | string, isCurrentlyFavorite?: boolean): Promise<boolean> => {
      if (!hasToken) {
        notificationService.error(FAVORITE_NOTIFICATIONS.NOT_AUTHORIZED);
        return false;
      }

      if (isPending(recipeId)) {
        return false;
      }

      const knownStatus = typeof isCurrentlyFavorite === "boolean" ? isCurrentlyFavorite : getFavoriteStatus(recipeId);
      const resolvedStatus = typeof knownStatus === "boolean" ? knownStatus : false;

      trackPendingRecipe(recipeId);

      if (resolvedStatus) {
        const removedRecipe = findRecipeSummaryById(recipeId);

        dispatch(optimisticRemoveFavorite({ recipeId }));
        dispatch(optimisticFavoriteStatus({ recipeId, isFavorite: false }));
        dispatch(adjustFavoritesCount(-1));

        const result = await dispatch(removeFavoriteRecipe({ recipeId }));
        const isRejected = removeFavoriteRecipe.rejected.match(result);

        if (isRejected) {
          if (removedRecipe) {
            dispatch(rollbackRemoveFavorite({ recipe: removedRecipe }));
          }
          dispatch(optimisticFavoriteStatus({ recipeId, isFavorite: true }));
          dispatch(adjustFavoritesCount(1));
          notificationService.error(FAVORITE_NOTIFICATIONS.REMOVE_ROLLBACK);
          releasePendingRecipe(recipeId);
          return false;
        }

        releasePendingRecipe(recipeId);
        return true;
      }

      const recipeToAdd = findRecipeSummaryById(recipeId);

      if (recipeToAdd) {
        dispatch(optimisticAddFavorite({ recipe: recipeToAdd }));
        dispatch(optimisticFavoriteStatus({ recipeId, isFavorite: true }));
        dispatch(adjustFavoritesCount(1));
      }

      const result = await dispatch(addFavoriteRecipe({ recipeId }));
      const isRejected = addFavoriteRecipe.rejected.match(result);

      if (isRejected) {
        if (recipeToAdd) {
          dispatch(rollbackAddFavorite({ recipeId }));
          dispatch(optimisticFavoriteStatus({ recipeId, isFavorite: false }));
          dispatch(adjustFavoritesCount(-1));
        }
        notificationService.error(FAVORITE_NOTIFICATIONS.ADD_ROLLBACK);
        releasePendingRecipe(recipeId);
        return false;
      }

      releasePendingRecipe(recipeId);
      return true;
    },
    [dispatch, findRecipeSummaryById, getFavoriteStatus, hasToken, isPending, releasePendingRecipe, trackPendingRecipe],
  );

  return {
    getFavoriteStatus,
    isFavorite,
    isPending,
    toggleFavorite,
  };
};
