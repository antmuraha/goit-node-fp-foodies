import type { AreaSummary } from "../area/types";
import type { CategorySummary } from "../category/model/types";
import type { RecipeIngredientDetails } from "../ingredient/types";
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
  Category: CategorySummary;
  author: UserSummary;
  Areas: AreaSummary[];
};

export type RecipeListResponse = {
  data: RecipeSummary[];
  total: number;
  limit: number;
  offset: number;
};

export type RecipeDetails = RecipeSummary & {
  Ingredients: RecipeIngredientDetails[];
};

export type RecipeSearchParams = {
  categoryId?: number;
  ingredientId?: number;
  areaId?: number;
  search?: string;
  limit?: number;
  offset?: number;
};
