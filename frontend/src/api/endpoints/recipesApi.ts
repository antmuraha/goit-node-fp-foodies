import { apiClient } from "../client";
import { API_ROUTES } from "../../shared/constants/apiRoutes";
import { getAuthHeaders } from "./helpers";
import type {
  CreateRecipePayload,
  FavoriteRecipe,
  RecipeDetails,
  RecipeListResponse,
  RecipeSearchParams,
  UpdateRecipePayload,
} from "../../entities/recipe/types";

type RecipeListQuery = Pick<RecipeSearchParams, "limit" | "offset">;

export const recipesApi = {
  client: apiClient,
  getRecipes: (query?: RecipeSearchParams): Promise<RecipeListResponse> =>
    apiClient.get<RecipeListResponse>(API_ROUTES.RECIPES.ROOT, { query }),
  getRecipeById: (id: number): Promise<RecipeDetails> => apiClient.get<RecipeDetails>(API_ROUTES.RECIPES.BY_ID(id)),
  getPopularRecipes: (query?: RecipeListQuery): Promise<RecipeListResponse> =>
    apiClient.get<RecipeListResponse>(API_ROUTES.RECIPES.POPULAR, { query }),
  getUserRecipes: (token: string, userId: number | string, query?: RecipeListQuery): Promise<RecipeListResponse> =>
    apiClient.get<RecipeListResponse>(API_ROUTES.USERS.RECIPES(userId), {
      query,
      headers: getAuthHeaders(token),
    }),
  getFavorites: (token: string, query?: RecipeListQuery): Promise<RecipeListResponse> =>
    apiClient.get<RecipeListResponse>(API_ROUTES.RECIPES.FAVORITES, {
      query,
      headers: getAuthHeaders(token),
    }),
  addFavorite: (token: string, recipeId: number): Promise<FavoriteRecipe> =>
    apiClient.post<FavoriteRecipe>(API_ROUTES.RECIPES.FAVORITE_BY_ID(recipeId), {
      headers: getAuthHeaders(token),
    }),
  removeFavorite: (token: string, recipeId: number): Promise<void> =>
    apiClient.delete<void>(API_ROUTES.RECIPES.FAVORITE_BY_ID(recipeId), {
      headers: getAuthHeaders(token),
    }),
  createRecipe: (token: string, payload: CreateRecipePayload): Promise<RecipeDetails> =>
    apiClient.post<RecipeDetails, CreateRecipePayload>(API_ROUTES.RECIPES.ROOT, {
      headers: getAuthHeaders(token),
      body: payload,
    }),
  updateRecipe: (token: string, recipeId: number, payload: UpdateRecipePayload): Promise<RecipeDetails> =>
    apiClient.put<RecipeDetails, UpdateRecipePayload>(API_ROUTES.RECIPES.BY_ID(recipeId), {
      headers: getAuthHeaders(token),
      body: payload,
    }),
  deleteRecipe: (token: string, recipeId: number | string): Promise<void> =>
    apiClient.delete<void>(API_ROUTES.RECIPES.BY_ID(recipeId), {
      headers: getAuthHeaders(token),
    }),
  uploadRecipeImage: (token: string, file: File): Promise<{ image: string }> => {
    const formData = new FormData();
    formData.append("image", file);

    return apiClient.post<{ image: string }, FormData>(API_ROUTES.RECIPES.UPLOAD_IMAGE, {
      headers: getAuthHeaders(token),
      body: formData,
    });
  },
};
