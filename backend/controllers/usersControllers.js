import { getUserProfileWithMetrics } from "../services/userServices.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    const profile = await getUserProfileWithMetrics(req.user.id);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};
