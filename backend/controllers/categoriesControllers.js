import { baseImageUrl } from "../config/constants.js";
import { listCategories, getCategory } from "../services/categoriesServices.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await listCategories();
    res.json(
      categories.map(({ id, name, description, image }) => ({
        id,
        name,
        description,
        image: image ? `${baseImageUrl}${image}` : null,
      })),
    );
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const category = await getCategory(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const { id, name, description, image } = category;
    res.json({ id, name, description, image: image ? `${baseImageUrl}${image}` : null });
  } catch (err) {
    next(err);
  }
};
