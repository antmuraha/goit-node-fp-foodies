import { listTestimonials } from "../services/testimonialsServices.js";
import validatePaginationParams from "../helpers/validatePaginationParams.js";

export const getTestimonials = async (req, res, next) => {
  try {
    const { limit, page } = validatePaginationParams(req.query);
    const result = await listTestimonials({ limit, page });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
