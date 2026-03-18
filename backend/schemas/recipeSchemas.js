import Joi from "joi";

const recipeIngredientSchema = Joi.object({
  ingredientId: Joi.number().integer().positive().required(),
  measure: Joi.string().min(1).max(100),
  quantity: Joi.alternatives().try(Joi.string().min(1).max(100), Joi.number().positive()),
  unit: Joi.string().max(32).allow("", null),
}).or("measure", "quantity");

export const createRecipeSchema = Joi.object({
  name: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(500).allow(""),
  instructions: Joi.string().min(10).required(),
  image: Joi.string().uri().allow(""),
  cookingTime: Joi.number().integer().min(1).max(600).required(),
  servings: Joi.number().integer().min(1).max(50).default(1),
  categoryId: Joi.number().integer().positive().required(),
  ingredients: Joi.array().items(recipeIngredientSchema).min(1).required(),
  areas: Joi.array().items(Joi.number().integer().positive()).length(1).required(),
});

export const updateRecipeSchema = Joi.object({
  name: Joi.string().min(3).max(200),
  description: Joi.string().max(500).allow(""),
  instructions: Joi.string().min(10),
  image: Joi.string().uri().allow(""),
  cookingTime: Joi.number().integer().min(1).max(600),
  servings: Joi.number().integer().min(1).max(50).default(1),
  categoryId: Joi.number().integer().positive(),
  ingredients: Joi.array().items(recipeIngredientSchema),
  areas: Joi.array().items(Joi.number().integer().positive()).length(1),
}).min(1);

export const searchRecipesSchema = Joi.object({
  keyword: Joi.string().max(100),
  categoryId: Joi.number().integer().positive(),
  areaId: Joi.number().integer().positive(),
  ingredientIds: Joi.alternatives().try(
    Joi.array().items(Joi.number().integer().positive()),
    Joi.string().pattern(/^\d+(,\d+)*$/),
  ),
  limit: Joi.number().integer().min(1).max(100).default(20),
  page: Joi.number().integer().min(1).default(1),
});
