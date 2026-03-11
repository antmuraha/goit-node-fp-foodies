import { useCallback, useEffect } from "react";
import { fetchRecipes } from "../../store/slices/recipesSlice";
import type { RecipeSearchParams } from "../../entities/recipe";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useDataRecipes = (query?: RecipeSearchParams) => {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((state) => state.recipes.list);
  const total = useAppSelector((state) => state.recipes.total);
  const status = useAppSelector((state) => state.recipes.listStatus);
  const error = useAppSelector((state) => state.recipes.listError);

  const loadRecipes = useCallback(() => {
    void dispatch(fetchRecipes(query));
  }, [dispatch, query]);

  useEffect(() => {
    if (status === "idle") {
      loadRecipes();
    }
  }, [loadRecipes, status]);

  return {
    recipes,
    total,
    isLoading: status === "loading",
    error,
    loadRecipes,
  };
};
