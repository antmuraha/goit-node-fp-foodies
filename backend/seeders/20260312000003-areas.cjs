"use strict";
import { loadCSV } from "../helpers/parseCSV.js";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = loadCSV("areas.csv");

    await queryInterface.bulkInsert(
      "areas",
      rows.map((r) => ({
        name: r.name,
        createdAt: now,
        updatedAt: now,
      })),
      { ignoreDuplicates: true },
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("areas", null, {});
  },
};
