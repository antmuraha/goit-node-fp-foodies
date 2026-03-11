import { listCategories } from "../services/categoriesServices.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await listCategories();
    res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
