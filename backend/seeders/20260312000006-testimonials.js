"use strict";

import { loadCSV } from "../helpers/parseCSV.js";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const now = new Date();

    // Build CSV user string-id → DB integer-id map
    const csvUsers = loadCSV("users.csv");
    const [dbUsers] = await queryInterface.sequelize.query(
      "SELECT id, email FROM users",
    );
    const userEmailToDbId = Object.fromEntries(dbUsers.map((u) => [u.email, u.id]));
    const csvUserIdToDbId = Object.fromEntries(
      csvUsers
        .filter((u) => userEmailToDbId[u.email] !== undefined)
        .map((u) => [u.id, userEmailToDbId[u.email]]),
    );

    const csvTestimonials = loadCSV("testimonials.csv");
    const rows = csvTestimonials
      .filter((t) => csvUserIdToDbId[t.owner_id] !== undefined)
      .map((t) => ({
        userId: csvUserIdToDbId[t.owner_id],
        content: t.testimonial,
        rating: null,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      }));

    if (rows.length > 0) {
      await queryInterface.bulkInsert("testimonials", rows, {
        ignoreDuplicates: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("testimonials", null, {});
  },
};
