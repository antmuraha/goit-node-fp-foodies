"use strict";

const { loadCSV } = require("../helpers/parseCSV.cjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = loadCSV("ingredients.csv");

    await queryInterface.bulkInsert(
      "ingredients",
      rows.map((r) => ({
        name: r.name,
        description: r.description || r.name,
        image: r.img || null,
        createdAt: now,
        updatedAt: now,
      })),
      { ignoreDuplicates: true },
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("ingredients", null, {});
  },
};
