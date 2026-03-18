import * as Yup from "yup";

export type RecipeIngredientFormValue = {
  ingredientId: number;
  measure: string;
};

export type RecipeEditorFormValues = {
  name: string;
  description: string;
  instructions: string;
  image: string;
  cookingTime: number;
  categoryId: string;
  ingredients: RecipeIngredientFormValue[];
  areas: number[];
  pendingIngredient: {
    ingredientId: number | null;
    measure: string;
  };
};

export const DEFAULT_RECIPE_FORM_VALUES: RecipeEditorFormValues = {
  name: "",
  description: "",
  instructions: "",
  image: "",
  cookingTime: 30,
  categoryId: "",
  ingredients: [],
  areas: [],
  pendingIngredient: {
    ingredientId: null,
    measure: "",
  },
};

export const recipeEditorSchema: Yup.ObjectSchema<RecipeEditorFormValues> = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name is too long")
    .required("Name is required"),
  description: Yup.string()
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  instructions: Yup.string()
    .min(10, "Instructions must be at least 10 characters")
    .required("Instructions are required"),
  image: Yup.string().url("Image must be a valid URL").required("Image URL is required"),
  cookingTime: Yup.number()
    .typeError("Cooking time must be a number")
    .integer("Cooking time must be a whole number")
    .min(1, "Cooking time must be at least 1 minute")
    .max(600, "Cooking time must be less than 600 minutes")
    .required("Cooking time is required"),
  categoryId: Yup.string().required("Category is required"),
  ingredients: Yup.array()
    .of(
      Yup.object({
        ingredientId: Yup.number().required("Ingredient is required"),
        measure: Yup.string()
          .min(1, "Measure is required")
          .max(100, "Measure is too long")
          .required("Measure is required"),
      }),
    )
    .min(1, "At least one ingredient is required")
    .required("Ingredients are required"),
  areas: Yup.array()
    .of(Yup.number().integer().positive().required())
    .min(1, "Please select an area")
    .max(1, "Only one area can be selected")
    .required("Area is required")
    .default([]),
  pendingIngredient: Yup.object({
    ingredientId: Yup.number().nullable().defined().default(null),
    measure: Yup.string().default("").max(100, "Measure is too long"),
  }),
});
