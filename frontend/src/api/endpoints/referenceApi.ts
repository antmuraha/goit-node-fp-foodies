import { apiClient } from "../client";
import { API_ROUTES } from "../../shared/constants/apiRoutes";

type ReferenceItem = {
  id: number;
  name: string;
};

type TestimonialsResponse = {
  data: Array<{
    id: number;
    testimonial: string;
    owner: {
      id: number;
      email: string;
    };
  }>;
  page: number;
  limit: number;
};

export const referenceApi = {
  client: apiClient,
  getCategories: (): Promise<ReferenceItem[]> => apiClient.get<ReferenceItem[]>(API_ROUTES.CATEGORIES.ROOT),
  getAreas: (): Promise<ReferenceItem[]> => apiClient.get<ReferenceItem[]>(API_ROUTES.AREAS.ROOT),
  getIngredients: (): Promise<ReferenceItem[]> => apiClient.get<ReferenceItem[]>(API_ROUTES.INGREDIENTS.ROOT),
  getTestimonials: (query?: { page?: number; limit?: number }): Promise<TestimonialsResponse> =>
    apiClient.get<TestimonialsResponse>(API_ROUTES.TESTIMONIALS.ROOT, { query }),
};
