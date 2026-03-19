import { useFormik } from "formik";
import { type ReactElement } from "react";
import { Button, FormErrorMessage, ImageInput, Input, Select, TextArea } from "../../../shared/ui";
import { DEFAULT_RECIPE_FORM_VALUES, recipeEditorSchema, type RecipeEditorFormValues } from "../validation";
import styles from "./RecipeEditorForm.module.css";

type ReferenceOption = {
  id: number;
  name: string;
};

type RecipeEditorFormProps = {
  isEdit: boolean;
  categories: ReferenceOption[];
  ingredientsOptions: ReferenceOption[];
  areas: ReferenceOption[];
  initialValues?: RecipeEditorFormValues;
  isCatalogLoading: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  isImageUploading?: boolean;
  imageUploadError?: string | null;
  onSubmit: (values: RecipeEditorFormValues) => Promise<void>;
  onCancel?: () => void;
};

type PendingIngredientErrors = {
  ingredientId?: string;
  measure?: string;
};

type PendingIngredientField = keyof RecipeEditorFormValues["pendingIngredient"];

const EMPTY_PENDING_INGREDIENT: RecipeEditorFormValues["pendingIngredient"] = {
  ingredientId: null,
  measure: "",
};

export const RecipeEditorForm = ({
   isEdit,
   categories,
   ingredientsOptions,
   areas,
   initialValues,
   isCatalogLoading,
   isSubmitting,
   submitError,
   isImageUploading = false,
   imageUploadError,
   onSubmit,
   onCancel,
}: RecipeEditorFormProps): ReactElement => {
  const formik = useFormik<RecipeEditorFormValues>({
    initialValues: initialValues ?? DEFAULT_RECIPE_FORM_VALUES,
    validationSchema: recipeEditorSchema,
    enableReinitialize: true,
    onSubmit: async (values, formikHelpers) => {
      void formikHelpers.setFieldValue("pendingIngredient", EMPTY_PENDING_INGREDIENT, false);
      void formikHelpers.setFieldTouched("pendingIngredient.ingredientId", false, false);
      void formikHelpers.setFieldTouched("pendingIngredient.measure", false, false);
      formikHelpers.setFieldError("pendingIngredient.ingredientId", undefined);
      formikHelpers.setFieldError("pendingIngredient.measure", undefined);

      await onSubmit(values);
    },
  });

  const validatePendingIngredient = (): PendingIngredientErrors => {
    const nextErrors: PendingIngredientErrors = {};
    const { pendingIngredient } = formik.values;

    if (!pendingIngredient.ingredientId) {
      nextErrors.ingredientId = "Ingredient is required";
    }

    const normalizedMeasure = pendingIngredient.measure.trim();

    if (!normalizedMeasure) {
      nextErrors.measure = "Measure is required";
    } else if (normalizedMeasure.length > 100) {
      nextErrors.measure = "Measure is too long";
    }

    return nextErrors;
  };

  const handlePendingIngredientChange = (field: "ingredientId" | "measure", value: string) => {
    formik.setFieldValue(`pendingIngredient.${field}`, value, false);

    if (getPendingIngredientTouched(field)) {
      formik.setFieldError(`pendingIngredient.${field}`, undefined);
    }
  };

  const handleAddIngredient = () => {
    void formik.setFieldTouched("pendingIngredient.ingredientId", true, false);
    void formik.setFieldTouched("pendingIngredient.measure", true, false);

    const nextErrors = validatePendingIngredient();
    formik.setFieldError("pendingIngredient.ingredientId", nextErrors.ingredientId);
    formik.setFieldError("pendingIngredient.measure", nextErrors.measure);

    if (nextErrors.ingredientId || nextErrors.measure) return;

    const hasDuplicateIngredient = formik.values.ingredients.some(
        (ingredientItem) => ingredientItem.ingredientId === formik.values.pendingIngredient.ingredientId,
    );

    if (hasDuplicateIngredient) {
      formik.setFieldError("pendingIngredient.ingredientId", "Ingredient is already added");
      return;
    }

    const nextIngredients = [
      ...formik.values.ingredients,
      {
        ingredientId: formik.values.pendingIngredient.ingredientId,
        measure: formik.values.pendingIngredient.measure.trim(),
      },
    ];

    formik.setFieldValue("ingredients", nextIngredients, true);
    void formik.setFieldTouched("ingredients", true);
    formik.setFieldError("ingredients", undefined);

    formik.setFieldValue("pendingIngredient", EMPTY_PENDING_INGREDIENT, false);
    void formik.setFieldTouched("pendingIngredient.ingredientId", false, false);
    void formik.setFieldTouched("pendingIngredient.measure", false, false);
    formik.setFieldError("pendingIngredient.ingredientId", undefined);
    formik.setFieldError("pendingIngredient.measure", undefined);
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    const nextIngredients = formik.values.ingredients.filter((_, index) => index !== indexToRemove);
    formik.setFieldValue("ingredients", nextIngredients, true);
    void formik.setFieldTouched("ingredients", true);
  };

  const ingredientOptionMap = ingredientsOptions.reduce<Record<string, string>>((accumulator, optionItem) => {
    accumulator[String(optionItem.id)] = optionItem.name;
    return accumulator;
  }, {});

  const getPendingIngredientError = (field: PendingIngredientField): string | undefined => {
    const pendingIngredientErrors = formik.errors.pendingIngredient;

    if (!pendingIngredientErrors || Array.isArray(pendingIngredientErrors)) {
      return undefined;
    }

    const fieldError = pendingIngredientErrors[field];
    return typeof fieldError === "string" ? fieldError : undefined;
  };

  const getPendingIngredientTouched = (field: PendingIngredientField): boolean => {
    const pendingIngredientTouched = formik.touched.pendingIngredient;

    if (
        !pendingIngredientTouched ||
        typeof pendingIngredientTouched !== "object" ||
        Array.isArray(pendingIngredientTouched)
    ) {
      return false;
    }

    return Boolean(pendingIngredientTouched[field]);
  };

  return (
      <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
        {/* Left column on desktop: image upload */}
        <div className={styles.imageCol}>
          <ImageInput
              id="recipe-image"
              label="Recipe image"
              initialImageUrl={typeof formik.values.image === "string" ? formik.values.image.trim() : undefined}
              accept="image/*"
              elementTrigger={<a href="#">Upload another photo</a>}
              targetWidth={551}
              targetHeight={400}
              onFileSelect={(file) => {
                if (file) formik.setFieldValue("image", file);
              }}
              disabled={isSubmitting || isImageUploading}
              hasError={Boolean(formik.touched.image && formik.errors.image) || Boolean(imageUploadError)}
              error={
                (formik.touched.image && formik.errors.image) || imageUploadError
                    ? (imageUploadError ?? (formik.touched.image ? formik.errors.image : undefined))
                    : undefined
              }
          />
        </div>

        {/* Right column on desktop: all form fields */}
        <div className={styles.fieldsCol}>
          {/* Recipe name */}
          <div className={styles.group}>
            <label className={styles.label} htmlFor="recipe-name">
              The name of the recipe
            </label>
            <Input
                id="recipe-name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter a description of the dish"
                hasError={Boolean(formik.touched.name && formik.errors.name)}
                disabled={isSubmitting}
            />
            {formik.touched.name && formik.errors.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
          </div>

          {/* Category + Cooking time — side by side per Figma */}
          <div className={styles.categoryTimeRow}>
            <div className={styles.group}>
              <label className={styles.label} htmlFor="recipe-category">
                Category
              </label>
              <Select
                  id="recipe-category"
                  placeholder="Select a category"
                  value={formik.values.categoryId}
                  hasError={Boolean(formik.touched.categoryId && formik.errors.categoryId)}
                  onChange={(event) => {
                    formik.setFieldValue("categoryId", event.target.value);
                    void formik.setFieldTouched("categoryId", true);
                  }}
                  disabled={isSubmitting || isCatalogLoading}
              >
                {categories.map((categoryItem) => (
                    <option key={categoryItem.id} value={String(categoryItem.id)}>
                      {categoryItem.name}
                    </option>
                ))}
              </Select>
              {formik.touched.categoryId && formik.errors.categoryId && (
                  <FormErrorMessage>{formik.errors.categoryId}</FormErrorMessage>
              )}
            </div>

            <div className={styles.group}>
              <label className={styles.label} htmlFor="recipe-cooking-time">
                Cooking time
              </label>
              <Input
                  id="recipe-cooking-time"
                  name="cookingTime"
                  type="number"
                  value={String(formik.values.cookingTime)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  hasError={Boolean(formik.touched.cookingTime && formik.errors.cookingTime)}
                  disabled={isSubmitting}
                  min={1}
                  max={600}
              />
              {formik.touched.cookingTime && formik.errors.cookingTime && (
                  <FormErrorMessage>{formik.errors.cookingTime}</FormErrorMessage>
              )}
            </div>
          </div>

          {/* Area */}
          <div className={styles.group}>
            <span className={styles.label}>Area</span>
            <Select
                id="area-pending"
                placeholder="Area"
                value={formik.values.areas[0] ? String(formik.values.areas[0]) : ""}
                hasError={Boolean(formik.touched.areas && typeof formik.errors.areas === "string")}
                onChange={(event) => {
                  const nextAreaId = Number(event.target.value);
                  const nextAreas = Number.isFinite(nextAreaId) && nextAreaId > 0 ? [nextAreaId] : [];
                  formik.setFieldValue("areas", nextAreas, true);
                  void formik.setFieldTouched("areas", true);
                }}
                disabled={isSubmitting || isCatalogLoading}
            >
              {areas.map((optionItem) => (
                  <option key={optionItem.id} value={String(optionItem.id)}>
                    {optionItem.name}
                  </option>
              ))}
            </Select>
            {formik.touched.areas && typeof formik.errors.areas === "string" && (
                <FormErrorMessage>{formik.errors.areas}</FormErrorMessage>
            )}
          </div>

          {/* Ingredients */}
          <div className={styles.group}>
            <span className={styles.label}>Ingredients</span>
            <div className={styles.ingredientEditorRow}>
              <div>
                <Select
                    id="ingredient-pending"
                    placeholder="Add the ingredient"
                    value={"" + formik.values.pendingIngredient.ingredientId}
                    hasError={Boolean(
                        getPendingIngredientTouched("ingredientId") && getPendingIngredientError("ingredientId"),
                    )}
                    onChange={(event) => handlePendingIngredientChange("ingredientId", event.target.value)}
                    disabled={isSubmitting || isCatalogLoading}
                >
                  {ingredientsOptions.map((optionItem) => (
                      <option key={optionItem.id} value={String(optionItem.id)}>
                        {optionItem.name}
                      </option>
                  ))}
                </Select>
                {getPendingIngredientTouched("ingredientId") && getPendingIngredientError("ingredientId") && (
                    <FormErrorMessage>{getPendingIngredientError("ingredientId")}</FormErrorMessage>
                )}
              </div>

              <div>
                <Input
                    id="ingredient-pending-measure"
                    value={formik.values.pendingIngredient.measure}
                    onChange={(event) => handlePendingIngredientChange("measure", event.target.value)}
                    onBlur={() => void formik.setFieldTouched("pendingIngredient.measure", true, false)}
                    placeholder="Enter quantity"
                    hasError={Boolean(getPendingIngredientTouched("measure") && getPendingIngredientError("measure"))}
                    disabled={isSubmitting}
                />
                {getPendingIngredientTouched("measure") && getPendingIngredientError("measure") && (
                    <FormErrorMessage>{getPendingIngredientError("measure")}</FormErrorMessage>
                )}
              </div>
            </div>

            <Button variant="secondary" onClick={handleAddIngredient} disabled={isSubmitting || isCatalogLoading}>
              Add ingredient +
            </Button>

            <div className={styles.ingredientTiles}>
              {formik.values.ingredients.map((ingredientItem, index) => (
                  <article key={`ingredient-tile-${index}`} className={styles.ingredientTile}>
                    <div>
                      <p className={styles.ingredientTileName}>
                        {ingredientOptionMap[ingredientItem.ingredientId] ?? "Unknown ingredient"}
                      </p>
                      <p className={styles.ingredientTileMeasure}>{ingredientItem.measure}</p>
                    </div>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleRemoveIngredient(index)}
                        disabled={isSubmitting}
                    >
                      Delete
                    </Button>
                  </article>
              ))}
            </div>

            {typeof formik.errors.ingredients === "string" && (
                <FormErrorMessage>{formik.errors.ingredients}</FormErrorMessage>
            )}
          </div>

          {/* Recipe Preparation */}
          <div className={styles.group}>
            <label className={styles.label} htmlFor="recipe-instructions">
              Recipe Preparation
            </label>
            <TextArea
                id="recipe-instructions"
                name="instructions"
                value={formik.values.instructions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter recipe"
                hasError={Boolean(formik.touched.instructions && formik.errors.instructions)}
                disabled={isSubmitting}
                rows={6}
                maxLength={1000}
            />
            {formik.touched.instructions && formik.errors.instructions && (
                <FormErrorMessage>{formik.errors.instructions}</FormErrorMessage>
            )}
          </div>

          {submitError && <FormErrorMessage variant="form">{submitError}</FormErrorMessage>}

          {/* Actions */}
          <div className={styles.actions}>
            <Button variant="secondary" isIconOnly onClick={onCancel} disabled={isSubmitting} aria-label="Delete draft">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 5H4.16667H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.66669 5V3.33333C6.66669 2.89131 6.84228 2.46738 7.15484 2.15482C7.4674 1.84226 7.89133 1.66667 8.33335 1.66667H11.6667C12.1087 1.66667 12.5326 1.84226 12.8452 2.15482C13.1578 2.46738 13.3334 2.89131 13.3334 3.33333V5M15.8334 5V16.6667C15.8334 17.1087 15.6578 17.5326 15.3452 17.8452C15.0326 18.1577 14.6087 18.3333 14.1667 18.3333H5.83335C5.39133 18.3333 4.9674 18.1577 4.65484 17.8452C4.34228 17.5326 4.16669 17.1087 4.16669 16.6667V5H15.8334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEdit ? "Update recipe" : "Publish"}
            </Button>
          </div>
        </div>
      </form>
  );
};