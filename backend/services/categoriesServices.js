import db from "../models/index.js";

const { Category } = db;

export const listCategories = () => Category.findAll({ order: [["name", "ASC"]] });
