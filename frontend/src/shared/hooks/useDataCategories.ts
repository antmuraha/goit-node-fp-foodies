import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { fetchCategories, fetchCategory } from "../../store/slices/categoriesSlice";

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

export const useDataCategory = (id?: string) => {
  const dispatch = useAppDispatch();
  const category = useAppSelector(
    (state) =>
      state.categories.list.find((cat) => cat.id === Number(id)) ||
      state.categories.categoryByIds[Number(id)] ||
      state.categories.selected,
  );
  const status = useAppSelector((state) => state.categories.selectedStatus);
  const error = useAppSelector((state) => state.categories.selectedError);

  const loadCategory = useCallback(() => {
    if (id) {
      void dispatch(fetchCategory(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (status === "idle") {
      loadCategory();
    }
  }, [loadCategory, status]);

  return {
    category,
    isLoading: status === "loading",
    error,
    loadCategory,
  };
};
