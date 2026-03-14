import { apiClient } from "../client";
import { API_ROUTES } from "../../shared/constants/apiRoutes";
import { CategoryListResponse } from "../../entities/recipe/model/types";

export const categoriesApi = {
  client: apiClient,
  getCategories: (): Promise<CategoryListResponse> => apiClient.get<CategoryListResponse>(API_ROUTES.CATEGORIES.ROOT),
};
