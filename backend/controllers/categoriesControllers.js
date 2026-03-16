import { listCategories } from "../services/categoriesServices.js";

const baseImageUrl = process.env.BASE_IMAGE_URL || "http://localhost:3000";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await listCategories();
    res.json(categories.map(({ id, name, image }) => ({ id, name, image: image ? baseImageUrl + image : null })));
  } catch (err) {
    next(err);
  }
};
