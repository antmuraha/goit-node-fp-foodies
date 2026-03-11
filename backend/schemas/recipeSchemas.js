import Joi from "joi";

export const createRecipeSchema = Joi.object({
  name: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(500).allow(""),
  instructions: Joi.string().min(10).required(),
  image: Joi.string().uri().allow(""),
  cookingTime: Joi.number().integer().min(1).max(600).required(),
  servings: Joi.number().integer().min(1).max(50).required(),
  categoryId: Joi.number().integer().positive().required(),
  ingredients: Joi.array()
    .items(
      Joi.object({
        ingredientId: Joi.number().integer().positive().required(),
        quantity: Joi.string().min(1).max(100).required(),
      }),
    )
    .min(1)
    .required(),
  areas: Joi.array().items(Joi.number().integer().positive()).min(0),
});

export const updateRecipeSchema = Joi.object({
  name: Joi.string().min(3).max(200),
  description: Joi.string().max(500).allow(""),
  instructions: Joi.string().min(10),
  image: Joi.string().uri().allow(""),
  cookingTime: Joi.number().integer().min(1).max(600),
  servings: Joi.number().integer().min(1).max(50),
  categoryId: Joi.number().integer().positive(),
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
