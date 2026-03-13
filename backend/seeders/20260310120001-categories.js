"use strict";
import { loadCSV } from "../helpers/parseCSV.js";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const now = new Date();
    const rows = loadCSV("categories.csv");

    await queryInterface.bulkInsert(
      "categories",
      rows.map((r) => ({
        name: r.name,
        image: null,
        createdAt: now,
        updatedAt: now,
      })),
      { ignoreDuplicates: true },
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
