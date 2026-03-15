export type IngredientSummary = {
  id: number;
  name: string;
  image: string | null;
};

export type RecipeIngredient = {
  quantity: string;
  unit: string | null;
};

export type RecipeIngredientDetails = IngredientSummary & {
  RecipeIngredient: RecipeIngredient;
};
