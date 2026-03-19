import { useCallback, useEffect } from "react";
import { fetchIngredients } from "../../store/slices/ingredientsSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useDataIngredients = () => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector((state) => state.ingredients.list);
  const status = useAppSelector((state) => state.ingredients.listStatus);
  const error = useAppSelector((state) => state.ingredients.listError);

  const loadIngredients = useCallback(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      loadIngredients();
    }
  }, [loadIngredients, status]);

  return {
    ingredients,
    isLoading: status === "loading",
    error,
    loadIngredients,
  };
};
