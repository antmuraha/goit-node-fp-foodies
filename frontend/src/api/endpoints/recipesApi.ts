import { apiClient } from "../client";
import { API_ROUTES } from "../../shared/constants/apiRoutes";
import type { RecipeListResponse, RecipeSearchParams, RecipeSummary } from "../../entities/recipe";

export const recipesApi = {
  client: apiClient,
  getRecipes: (query?: RecipeSearchParams): Promise<RecipeListResponse> =>
    apiClient.get<RecipeListResponse>(API_ROUTES.RECIPES.ROOT, { query }),
  getRecipeById: (id: number): Promise<RecipeSummary> => apiClient.get<RecipeSummary>(API_ROUTES.RECIPES.BY_ID(id)),
};
