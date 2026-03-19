import { baseImageUrl } from "../config/constants.js";
import { listCategories } from "../services/categoriesServices.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await listCategories();
    res.json(categories.map(({ id, name, image }) => ({ id, name, image: image ? baseImageUrl + image : null })));
  } catch (err) {
    next(err);
  }
};
