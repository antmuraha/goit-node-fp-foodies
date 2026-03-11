import db from "../models/index.js";

const { Ingredient } = db;

export const listIngredients = () => Ingredient.findAll({ order: [["name", "ASC"]] });
