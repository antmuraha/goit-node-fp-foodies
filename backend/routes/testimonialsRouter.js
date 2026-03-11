import { Router } from "express";
import { getTestimonials } from "../controllers/testimonialsControllers.js";

const testimonialsRouter = new Router();

testimonialsRouter.get("/", getTestimonials);

export default testimonialsRouter;
