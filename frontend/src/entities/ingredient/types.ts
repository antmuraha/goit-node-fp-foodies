export type IngredientSummary = {
  id: number;
  name: string;
  image: string | null;
};

export type RecipeIngredientItem = {
  id: number;
  measure: string;
  name: string;
  image: string;
};
