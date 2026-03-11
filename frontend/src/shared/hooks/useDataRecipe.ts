import { useCallback, useEffect } from "react";
import { clearSelectedRecipe, fetchRecipeById } from "../../store/slices/recipesSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useDataRecipe = (recipeId?: number) => {
  const dispatch = useAppDispatch();
  const recipe = useAppSelector((state) => state.recipes.selectedRecipe);
  const status = useAppSelector((state) => state.recipes.selectedRecipeStatus);
  const error = useAppSelector((state) => state.recipes.selectedRecipeError);

  const loadRecipe = useCallback(
    (id: number) => {
      void dispatch(fetchRecipeById(id));
    },
    [dispatch],
  );

  useEffect(() => {
    if (recipeId && Number.isFinite(recipeId)) {
      loadRecipe(recipeId);
      return;
    }

    dispatch(clearSelectedRecipe());
  }, [dispatch, loadRecipe, recipeId]);

  return {
    recipe,
    isLoading: status === "loading",
    error,
    loadRecipe,
  };
};
