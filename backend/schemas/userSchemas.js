import Joi from "joi";

export const avatarUpdateSchema = Joi.object({
  avatar: Joi.string().uri().allow(null, "").messages({
    "string.uri": "Avatar must be a valid URL",
  }),
});

export const followParamsSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
}).min(1);
