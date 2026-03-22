import { useFormik } from "formik";
import { type ReactElement, useEffect } from "react";
import { Button, FormErrorMessage, ImageInput, Input, Select, TextArea } from "../../../shared/ui";
import { NumericStepper } from "../../../shared/ui/numeric-stepper";
import { Icon } from "../../../shared/components/Icon";
import RecipeIngredientsPanel from "../../recipe/ui/RecipeIngredientsPanel";
import { DEFAULT_RECIPE_FORM_VALUES, recipeEditorSchema, type RecipeEditorFormValues } from "../validation";
import { notificationService } from "../../../shared/services/notifications";
import styles from "./RecipeEditorForm.module.css";

type IngredientOption = {
  id: number;
  name: string;
  image: string;
};

type ReferenceOption = {
  id: number;
  name: string;
};

type RecipeEditorFormProps = {
  isEdit: boolean;
  categories: ReferenceOption[];
  ingredientsOptions: IngredientOption[];
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
  useEffect(() => {
    if (submitError) notificationService.error(submitError);
  }, [submitError]);

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
        ingredientId: Number(formik.values.pendingIngredient.ingredientId),
        measure: formik.values.pendingIngredient.measure.trim(),
      },
    ];

    void formik.setFieldValue("ingredients", nextIngredients, false);

    formik.setFieldValue("pendingIngredient", EMPTY_PENDING_INGREDIENT, false);
    void formik.setFieldTouched("pendingIngredient.ingredientId", false, false);
    void formik.setFieldTouched("pendingIngredient.measure", false, false);
    formik.setFieldError("pendingIngredient.ingredientId", undefined);
    formik.setFieldError("pendingIngredient.measure", undefined);
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    const nextIngredients = formik.values.ingredients.filter((_, index) => index !== indexToRemove);
    void formik.setFieldValue("ingredients", nextIngredients, false);
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
      <div className={styles.imageCol}>
        <ImageInput
          id="recipe-image"
          initialImageUrl={typeof formik.values.image === "string" ? formik.values.image.trim() : undefined}
          accept="image/*"
          elementTrigger={<a href="#">Upload another photo</a>}
          targetWidth={551}
          targetHeight={400}
          onFileSelect={(file) => {
            if (file) void formik.setFieldValue("image", file, false);
          }}
          disabled={isSubmitting || isImageUploading}
          hasError={Boolean(formik.errors.image) || Boolean(imageUploadError)}
          error={formik.errors.image || imageUploadError ? imageUploadError || formik.errors.image : undefined}
        />
      </div>

      {/* Right column on desktop: all form fields */}
      <div className={styles.fieldsCol}>
        {/*
          Recipe name — Figma node 44:1557 / 108:4618 / 114:5133
          Label: #bfbebe, ExtraBold, 24px desktop / 16px mobile, uppercase
          Input: underline only, placeholder "Enter a description of the dish"
          Counter: 0/200 inline right — Figma node 22:741
        */}
        <div className={styles.groupName}>
          <div className={styles.inputWithCounter}>
            <div className={styles.inputCounterField}>
              <Input
                id="recipe-name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="The name of the recipe"
                hasError={Boolean(formik.touched.name && formik.errors.name)}
                disabled={isSubmitting}
                maxLength={200}
                className={styles.underlineInput}
              />
            </div>
            <span className={styles.counter}>{formik.values.name.length}/200</span>
          </div>
          {formik.touched.name && formik.errors.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
        </div>

        {/* Description */}
        <div className={styles.group}>
          <label className={styles.label} htmlFor="recipe-description">
            Description
          </label>
          <TextArea
            id="recipe-description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter a description of the dish"
            hasError={Boolean(formik.touched.description && formik.errors.description)}
            disabled={isSubmitting}
            rows={4}
            maxLength={3000}
          />
          {formik.touched.description && formik.errors.description && (
            <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
          )}
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
                void formik.setFieldValue("categoryId", event.target.value);
              }}
              onBlur={() => void formik.setFieldTouched("categoryId", true)}
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
            <NumericStepper
              value={Number(formik.values.cookingTime)}
              min={1}
              max={600}
              step={10}
              label="Cooking time in minutes"
              onChange={(next) => {
                void formik.setFieldValue("cookingTime", next, false);
              }}
            />
            {formik.touched.cookingTime && formik.errors.cookingTime && (
              <FormErrorMessage>{formik.errors.cookingTime}</FormErrorMessage>
            )}
          </div>
        </div>

        {/*
          Area — Figma node 12385:2704 width=330px on desktop.
          groupArea constrains max-width so it doesn't stretch the full column.
        */}
        <div className={styles.groupArea}>
          <span className={styles.label}>Area</span>
          <Select
            id="area-pending"
            placeholder="Area"
            value={formik.values.areas[0] ? String(formik.values.areas[0]) : ""}
            hasError={Boolean(formik.touched.areas && typeof formik.errors.areas === "string")}
            onChange={(event) => {
              const nextAreaId = Number(event.target.value);
              const nextAreas = Number.isFinite(nextAreaId) && nextAreaId > 0 ? [nextAreaId] : [];
              void formik.setFieldValue("areas", nextAreas);
            }}
            onBlur={() => void formik.setFieldTouched("areas", true)}
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
              {/* Figma: underline only, not bordered pill — node 92:1890 */}
              <Input
                id="ingredient-pending-measure"
                value={formik.values.pendingIngredient.measure}
                onChange={(event) => handlePendingIngredientChange("measure", event.target.value)}
                onBlur={() => void formik.setFieldTouched("pendingIngredient.measure", true, false)}
                placeholder="Enter quantity"
                hasError={Boolean(getPendingIngredientTouched("measure") && getPendingIngredientError("measure"))}
                disabled={isSubmitting}
                className={styles.underlineInput}
              />
              {getPendingIngredientTouched("measure") && getPendingIngredientError("measure") && (
                <FormErrorMessage>{getPendingIngredientError("measure")}</FormErrorMessage>
              )}
            </div>
          </div>

          {/* Figma node 22:794 / 108:4648 / 114:5163 */}
          <Button
            variant="secondary"
            className={styles.addIngredientBtn}
            onClick={handleAddIngredient}
            disabled={isSubmitting || isCatalogLoading}
          >
            Add ingredient +
          </Button>

          {formik.values.ingredients.length > 0 && (
            <RecipeIngredientsPanel
              showHeading={false}
              ingredients={formik.values.ingredients.map((ing) => ({
                id: ing.ingredientId,
                name: ingredientOptionMap[String(ing.ingredientId)] ?? "Unknown",
                measure: ing.measure,
                image: ingredientsOptions.find((option) => option.id === ing.ingredientId)?.image ?? "",
              }))}
              onRemove={handleRemoveIngredient}
            />
          )}

          {formik.touched.ingredients && typeof formik.errors.ingredients === "string" && (
            <FormErrorMessage>{formik.errors.ingredients}</FormErrorMessage>
          )}
        </div>

        {/* Recipe Preparation */}
        <div className={styles.groupRecipePrep}>
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
            rows={3}
            maxLength={3000}
            className={styles.instructionsTextarea}
          />
          {formik.touched.instructions && formik.errors.instructions && (
            <FormErrorMessage>{formik.errors.instructions}</FormErrorMessage>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            isIconOnly
            className={styles.deleteBtn}
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Delete draft"
          >
            <Icon name="trash" color="text-primary" size={20} />
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Update recipe" : "Publish"}
          </Button>
        </div>
      </div>
    </form>
  );
};
