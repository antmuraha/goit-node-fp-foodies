import { useCallback, useEffect } from "react";
import { fetchPopularRecipes } from "../../store/slices/recipesSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useDataPopularRecipes = (params?: { limit?: number }) => {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((state) => state.recipes.popularList);
  const page = useAppSelector((state) => state.recipes.popularPage);
  const status = useAppSelector((state) => state.recipes.popularListStatus);
  const error = useAppSelector((state) => state.recipes.popularListError);

  const loadRecipes = useCallback(() => {
    void dispatch(fetchPopularRecipes({ limit: params?.limit }));
  }, [dispatch, params?.limit]);

  useEffect(() => {
    if (status === "idle") {
      loadRecipes();
    }
  }, [loadRecipes, status]);

  return {
    recipes,
    page,
    isLoading: status === "loading",
    error,
    loadRecipes,
  };
};
