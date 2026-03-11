import { listAreas } from "../services/areasServices.js";

export const getAreas = async (req, res, next) => {
  try {
    const areas = await listAreas();
    res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.json(areas);
  } catch (err) {
    next(err);
  }
};
