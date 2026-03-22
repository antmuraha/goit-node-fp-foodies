import type { ReactElement } from "react";
import { useEffect, useMemo } from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { RecipeEditorForm } from "../../features/recipe-create/ui";
import type { CreateRecipePayload } from "../../entities/recipe/types";
import { DEFAULT_RECIPE_FORM_VALUES, type RecipeEditorFormValues } from "../../features/recipe-create/validation";
import {
  useAppDispatch,
  useAppSelector,
  useDataAreas,
  useDataCategories,
  useDataIngredients,
  useDataRecipe,
  useDataRecipes,
} from "../../shared/hooks";
import { APP_ROUTES } from "../../shared/constants/routes";
import { createRecipe, resetEditorSubmitState, updateRecipe } from "../../store/slices/recipesSlice";
import { adjustRecipesCreatedCount } from "../../store/slices/authSlice";
import { adjustSelectedUserRecipesCreatedCount } from "../../store/slices/usersSlice";
import styles from "./AddRecipePage.module.css";

export const AddRecipePage = (): ReactElement => {
  /*
  TODO: Refactor project-wide
  1. Do NOT use `const dispatch = useAppDispatch();` in any Component.
  2. Replace all component-level dispatch calls with entity-level hooks like `useDataSomeEntity`.
  3. Audit all files to ensure no direct use of `useAppDispatch` remains.
  4. Ensure async/data operations are handled through the entity hooks only.
  */
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isEdit = useMatch(APP_ROUTES.RECIPE_EDIT);
  const { id } = useParams();

  const recipeId = useMemo(() => {
    const parsedId = Number(id);
    return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : undefined;
  }, [id]);

  const { recipe, isLoading: isRecipeLoading, error: recipeError } = useDataRecipe(isEdit ? recipeId : undefined);
  const { categories, isLoading: isCategoriesLoading, error: categoriesError } = useDataCategories();
  const { ingredients, isLoading: isIngredientsLoading, error: ingredientsError } = useDataIngredients();
  const { areas, isLoading: isAreasLoading, error: areasError } = useDataAreas();
  const { uploadImage, isImageUploading, imageUploadError } = useDataRecipes();

  const editorSubmitStatus = useAppSelector((state) => state.recipes.editorSubmitStatus);
  const editorSubmitError = useAppSelector((state) => state.recipes.editorSubmitError);

  const isCatalogLoading = isCategoriesLoading || isIngredientsLoading || isAreasLoading;
  const catalogError = categoriesError ?? ingredientsError ?? areasError;

  useEffect(() => {
    return () => {
      dispatch(resetEditorSubmitState());
    };
  }, [dispatch]);

  const initialValues = useMemo<RecipeEditorFormValues>(() => {
    if (!recipe) {
      return DEFAULT_RECIPE_FORM_VALUES;
    }

    return {
      name: recipe.title,
      description: recipe.description ?? "",
      instructions: recipe.instructions ?? "",
      image: recipe.image ?? "",
      cookingTime: recipe.cookingTime ?? 30,
      categoryId: String(recipe.categoryId),
      ingredients:
        recipe.ingredients.length > 0
          ? recipe.ingredients.map((ingredientItem) => ({
              ingredientId: ingredientItem.id,
              measure: ingredientItem.measure,
            }))
          : DEFAULT_RECIPE_FORM_VALUES.ingredients,
      areas: recipe.areas.map((areaItem) => areaItem.id),
      pendingIngredient: DEFAULT_RECIPE_FORM_VALUES.pendingIngredient,
    };
  }, [recipe]);

  const handleSubmit = async (values: RecipeEditorFormValues): Promise<void> => {
    dispatch(resetEditorSubmitState());

    let imageUrl: string | null = null;

    if (values.image instanceof File) {
      imageUrl = await uploadImage(values.image);
      if (!imageUrl) return;
    } else {
      imageUrl = values.image.trim();
    }

    const payload: CreateRecipePayload = {
      name: values.name.trim(),
      description: values.description.trim(),
      instructions: values.instructions.trim(),
      image: imageUrl,
      cookingTime: Number(values.cookingTime),
      categoryId: Number(values.categoryId),
      ingredients: values.ingredients.map((ingredientItem) => ({
        ingredientId: Number(ingredientItem.ingredientId),
        measure: ingredientItem.measure.trim(),
      })),
      areas: values.areas,
    };

    const result =
      isEdit && recipeId
        ? await dispatch(updateRecipe({ id: recipeId, payload }))
        : await dispatch(createRecipe(payload));

    if (createRecipe.fulfilled.match(result)) {
      dispatch(adjustRecipesCreatedCount(1));
      dispatch(adjustSelectedUserRecipesCreatedCount({ userId: result.payload.userId, delta: 1 }));
    }

    if (createRecipe.fulfilled.match(result) || updateRecipe.fulfilled.match(result)) {
      navigate(APP_ROUTES.RECIPE_DETAILS.replace(":id", String(result.payload.id)));
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const pageLabel = isEdit ? "Edit recipe" : "Add recipe";

  return (
    <main className={styles.page}>
      {/* Page header — Figma nodes 44:1555 / 108:4598 / 114:5114 */}
      <div className={styles.header}>
        {/* Breadcrumbs: Home / Add recipe — Figma nodes 22:475 / 108:4599 / 114:5115 */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <span className={styles.breadcrumbMuted}>Home</span>
          <span className={styles.breadcrumbMuted}>/</span>
          <span className={styles.breadcrumbActive}>{pageLabel}</span>
        </nav>

        {/* Title + subtitle */}
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{pageLabel}</h1>
          <p className={styles.subtitle}>
            Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us.
          </p>
        </div>
      </div>

      {isEdit && isRecipeLoading && <p>Loading recipe data...</p>}
      {isEdit && recipeError && <p>Unable to load recipe: {recipeError}</p>}
      {catalogError && <p>Unable to load catalog data: {catalogError}</p>}

      {(!isEdit || recipe) && (
        <RecipeEditorForm
          isEdit={Boolean(isEdit)}
          categories={categories}
          ingredientsOptions={ingredients}
          areas={areas}
          initialValues={initialValues}
          isCatalogLoading={isCatalogLoading}
          isSubmitting={editorSubmitStatus === "loading" || isImageUploading}
          submitError={editorSubmitError ?? imageUploadError}
          isImageUploading={isImageUploading}
          imageUploadError={imageUploadError}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </main>
  );
};
