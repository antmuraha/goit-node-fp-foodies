import db from "../models/index.js";

const { Testimonial, User } = db;

export const listTestimonials = async (options) => {
  const page = options.page || 1;
  const limit = options.limit || 20;
  const offset = (page - 1) * limit;

  const testimonials = await Testimonial.findAll({
    where: { isPublished: true },
    include: [{ model: User, as: "owner", attributes: ["id", "name", "email"] }],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    data: testimonials,
    page,
    limit,
  };
};
