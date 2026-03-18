import { useFormik } from "formik";
import { type ReactElement } from "react";
import { Button, FormErrorMessage, Input, Select, TextArea } from "../../../shared/ui";
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
  onSubmit,
  onCancel,
}: RecipeEditorFormProps): ReactElement => {
  const formik = useFormik<RecipeEditorFormValues>({
    initialValues: initialValues ?? DEFAULT_RECIPE_FORM_VALUES,
    validationSchema: recipeEditorSchema,
    enableReinitialize: true,
    onSubmit: async (values, formikHelpers) => {
      formikHelpers.setFieldValue("pendingIngredient", EMPTY_PENDING_INGREDIENT, false);
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

    if (nextErrors.ingredientId || nextErrors.measure) {
      return;
    }

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

    if (!pendingIngredientErrors || typeof pendingIngredientErrors === "string" || Array.isArray(pendingIngredientErrors)) {
      return undefined;
    }

    const fieldError = pendingIngredientErrors[field];
    return typeof fieldError === "string" ? fieldError : undefined;
  };

  const getPendingIngredientTouched = (field: PendingIngredientField): boolean => {
    const pendingIngredientTouched = formik.touched.pendingIngredient;

    if (!pendingIngredientTouched || typeof pendingIngredientTouched !== "object" || Array.isArray(pendingIngredientTouched)) {
      return false;
    }

    return Boolean(pendingIngredientTouched[field]);
  };

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
      <div className={styles.group}>
        <label className={styles.label} htmlFor="recipe-image-url">
          Image URL
        </label>
        <Input
          id="recipe-image-url"
          name="image"
          value={formik.values.image}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="https://example.com/recipe-image.jpg"
          hasError={Boolean(formik.touched.image && formik.errors.image)}
          disabled={isSubmitting}
        />
        {formik.touched.image && formik.errors.image && <FormErrorMessage>{formik.errors.image}</FormErrorMessage>}
      </div>
      <div className={styles.grid}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="recipe-name">
            Recipe name
          </label>
          <Input
            id="recipe-name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter recipe name"
            hasError={Boolean(formik.touched.name && formik.errors.name)}
            disabled={isSubmitting}
          />
          {formik.touched.name && formik.errors.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
        </div>

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
            placeholder="Describe this recipe"
            hasError={Boolean(formik.touched.description && formik.errors.description)}
            disabled={isSubmitting}
            rows={4}
          />
          {formik.touched.description && formik.errors.description && (
            <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
          )}
        </div>

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
      </div>

      <div className={styles.grid}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="recipe-cooking-time">
            Cooking time (minutes)
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

      <div className={styles.group}>
        <span className={styles.label}>Areas</span>
        <div className={styles.areas}>
          <Select
            id="area-pending"
            placeholder="Select area"
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
        </div>
        {formik.touched.areas && typeof formik.errors.areas === "string" && (
          <FormErrorMessage>{formik.errors.areas}</FormErrorMessage>
        )}
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Ingredients</span>
        <div className={styles.ingredientEditor}>
          <div className={styles.ingredientEditorRow}>
            <div>
              <Select
                id="ingredient-pending"
                placeholder="Select ingredient"
                value={"" + formik.values.pendingIngredient.ingredientId}
                hasError={Boolean(getPendingIngredientTouched("ingredientId") && getPendingIngredientError("ingredientId"))}
                onChange={(event) => {
                  handlePendingIngredientChange("ingredientId", event.target.value);
                }}
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
                onChange={(event) => {
                  handlePendingIngredientChange("measure", event.target.value);
                }}
                onBlur={() => {
                  void formik.setFieldTouched("pendingIngredient.measure", true, false);
                }}
                placeholder="Quantity (e.g. 200g, 1 sprig)"
                hasError={Boolean(getPendingIngredientTouched("measure") && getPendingIngredientError("measure"))}
                disabled={isSubmitting}
              />
              {getPendingIngredientTouched("measure") && getPendingIngredientError("measure") && (
                <FormErrorMessage>{getPendingIngredientError("measure")}</FormErrorMessage>
              )}
            </div>
          </div>

          <Button variant="ghost" onClick={handleAddIngredient} disabled={isSubmitting || isCatalogLoading}>
            Add ingredient
          </Button>
        </div>

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
          placeholder="Provide the cooking instructions"
          hasError={Boolean(formik.touched.instructions && formik.errors.instructions)}
          disabled={isSubmitting}
          rows={6}
        />
        {formik.touched.instructions && formik.errors.instructions && (
          <FormErrorMessage>{formik.errors.instructions}</FormErrorMessage>
        )}
      </div>

      {submitError && <FormErrorMessage variant="form">{submitError}</FormErrorMessage>}

      <div className={styles.actions}>
        <Button type="submit" isLoading={isSubmitting}>
          {isEdit ? "Update recipe" : "Publish recipe"}
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
