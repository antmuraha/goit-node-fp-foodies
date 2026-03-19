import { useCallback, useEffect } from "react";
import { fetchRecipes, uploadRecipeImage } from "../../store/slices/recipesSlice";
import type { RecipeSearchParams } from "../../entities/recipe/types";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export const useDataRecipes = (query?: RecipeSearchParams) => {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((state) => state.recipes.list);
  const total = useAppSelector((state) => state.recipes.total);
  const status = useAppSelector((state) => state.recipes.listStatus);
  const error = useAppSelector((state) => state.recipes.listError);
  const imageUploadStatus = useAppSelector((state) => state.recipes.imageUploadStatus);
  const imageUploadError = useAppSelector((state) => state.recipes.imageUploadError);

  const loadRecipes = useCallback(() => {
    void dispatch(fetchRecipes(query));
  }, [dispatch, query]);

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      const result = await dispatch(uploadRecipeImage(file));
      return uploadRecipeImage.fulfilled.match(result) ? result.payload : null;
    },
    [dispatch],
  );

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
    uploadImage,
    isImageUploading: imageUploadStatus === "loading",
    imageUploadError,
  };
};
