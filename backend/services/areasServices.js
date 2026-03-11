import db from "../models/index.js";

const { Area } = db;

export const listAreas = () => Area.findAll({ order: [["name", "ASC"]] });
