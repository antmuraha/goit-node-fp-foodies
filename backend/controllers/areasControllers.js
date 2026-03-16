import { listAreas } from "../services/areasServices.js";

export const getAreas = async (req, res, next) => {
  try {
    const areas = await listAreas();
    res.json(areas);
  } catch (err) {
    next(err);
  }
};
