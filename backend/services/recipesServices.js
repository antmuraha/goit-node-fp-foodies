import { Op } from "sequelize";
import db from "../models/index.js";

const { Recipe, Category, User, Ingredient, Area } = db;

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const searchRecipes = async ({ categoryId, ingredientId, areaId, search, limit, offset }) => {
  const safeLimit = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const where = {};
  if (categoryId) where.categoryId = Number(categoryId);
  if (search) where.name = { [Op.iLike]: `%${search}%` };

  const include = [
    { model: Category, attributes: ["id", "name", "image"] },
    { model: User, as: "author", attributes: ["id", "name", "avatar"] },
  ];

  if (ingredientId) {
    include.push({
      model: Ingredient,
      through: { attributes: [] },
      where: { id: Number(ingredientId) },
      required: true,
      attributes: [],
    });
  }

  if (areaId) {
    include.push({
      model: Area,
      through: { attributes: [] },
      where: { id: Number(areaId) },
      required: true,
      attributes: [],
    });
  }

  const { count, rows } = await Recipe.findAndCountAll({
    where,
    include,
    limit: safeLimit,
    offset: safeOffset,
    distinct: true,
    order: [["createdAt", "DESC"]],
  });

  return { total: count, limit: safeLimit, offset: safeOffset, recipes: rows };
};

export const getRecipeById = async (id) => {
  return Recipe.findByPk(id, {
    include: [
      { model: Category, attributes: ["id", "name", "image"] },
      { model: User, as: "author", attributes: ["id", "name", "avatar"] },
      {
        model: Ingredient,
        through: { attributes: ["quantity", "unit"] },
        attributes: ["id", "name", "image"],
      },
      {
        model: Area,
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
    ],
  });
};
