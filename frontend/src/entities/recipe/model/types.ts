import type { UserSummary } from "../../user";

export type RecipeSummary = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  author?: UserSummary;
};

export type RecipeListResponse = {
  recipes: RecipeSummary[];
  total: number;
  limit: number;
  offset: number;
};

export type RecipeSearchParams = {
  categoryId?: number;
  ingredientId?: number;
  areaId?: number;
  search?: string;
  limit?: number;
  offset?: number;
};

export type CategorySummary = {
  id: number;
  name: string;
  image?: string;
};

export type CategoryListResponse = CategorySummary[];
