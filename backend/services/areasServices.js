import db from "../models/index.js";

const { Area } = db;

export const listCategories = () => Area.findAll({ order: [["name", "ASC"]] });
