import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { fetchCategories } from "../../store/slices/categoriesSlice";

export const useDataCategories = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.list);
  const status = useAppSelector((state) => state.categories.listStatus);
  const error = useAppSelector((state) => state.categories.listError);

  const loadCategories = useCallback(() => {
    void dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      loadCategories();
    }
  }, [loadCategories, status]);

  return {
    categories,
    isLoading: status === "loading",
    error,
    loadCategories,
  };
};
