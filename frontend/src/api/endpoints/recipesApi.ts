import { apiClient } from "../client";
import { API_ROUTES } from "../../shared/constants/apiRoutes";
import type { RecipeListResponse, RecipeSearchParams } from "../../entities/recipe/types";
import { RecipeDetails } from "../../entities/recipe/types";

export const recipesApi = {
  client: apiClient,
  getRecipes: (query?: RecipeSearchParams): Promise<RecipeListResponse> =>
    apiClient.get<RecipeListResponse>(API_ROUTES.RECIPES.ROOT, { query }),
  getRecipeById: (id: number): Promise<RecipeDetails> => apiClient.get<RecipeDetails>(API_ROUTES.RECIPES.BY_ID(id)),
  getPopularRecipes: (): Promise<RecipeListResponse> => apiClient.get<RecipeListResponse>(API_ROUTES.RECIPES.POPULAR),
};
