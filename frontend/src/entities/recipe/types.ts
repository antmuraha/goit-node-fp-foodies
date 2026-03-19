import type { AreaSummary } from "../area/types";
import type { CategorySummary } from "../category/model/types";
import type { RecipeIngredientItem } from "../ingredient/types";
import type { UserSummary } from "../user";

export type RecipeSummary = {
  id: number;
  title: string;
  description: string;
  instructions: string;
  cookingTime: number;
  thumbnail: string | null;
  image: string | null;
  categoryId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  category: CategorySummary;
  author: UserSummary;
  areas: AreaSummary[];
};

export type RecipeListResponse = {
  data: RecipeSummary[];
  total: number;
  limit: number;
  offset: number;
};

export type RecipeDetails = RecipeSummary & {
  ingredients: RecipeIngredientItem[];
};

export type RecipeSearchParams = {
  categoryId?: number;
  ingredientId?: number;
  areaId?: number;
  search?: string;
  limit?: number;
  offset?: number;
};

export type FavoriteRecipe = {
  id: number;
  userId: number;
  recipeId: number;
  createdAt: string;
  updatedAt: string;
};

export type RecipeIngredientPayload = {
  ingredientId: number;
  measure: string;
};

export type CreateRecipePayload = {
  name: string;
  description?: string;
  instructions: string;
  image?: string | null;
  cookingTime: number;
  categoryId: number;
  ingredients: RecipeIngredientPayload[];
  areas: number[];
};

export type UpdateRecipePayload = Partial<CreateRecipePayload>;
