import { apiClient } from "../client";
import { API_ROUTES } from "../../shared/constants/apiRoutes";
import type { CategoryListResponse, CategorySummary } from "../../entities/category/model/types";

export const categoriesApi = {
  client: apiClient,
  getCategories: (): Promise<CategoryListResponse> => apiClient.get<CategoryListResponse>(API_ROUTES.CATEGORIES.ROOT),
  getCategoryById: (id: number) => apiClient.get<CategorySummary>(`${API_ROUTES.CATEGORIES.ROOT}/${id}`),
};
