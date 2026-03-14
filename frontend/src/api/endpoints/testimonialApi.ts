import { apiClient } from "../client";
import { API_ROUTES } from "../../shared/constants/apiRoutes";
import type { TestimonialListResponse } from "../../entities/testimonial/model/types";

export const testimonialApi = {
  client: apiClient,
  getTestimonials: (): Promise<TestimonialListResponse> =>
    apiClient.get<TestimonialListResponse>(API_ROUTES.TESTIMONIALS.ROOT),
};
