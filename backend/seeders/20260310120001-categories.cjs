"use strict";
import { loadCSV } from "../helpers/parseCSV.js";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = /** @type {Array<{ name: string; image?: string }>} */ (loadCSV("categories.csv"));
    const [existingCategories] = /** @type {[Array<{ id: number; name: string }>, unknown]} */ (
      await queryInterface.sequelize.query("SELECT id, name FROM categories")
    );
    const existingCategoryIdByName = new Map(existingCategories.map((category) => [category.name, category.id]));

    const rowsToInsert = [];
    const rowsToUpdate = [];

    for (const row of rows) {
      const image = row.image || null;
      const existingId = existingCategoryIdByName.get(row.name);

      if (existingId) {
        rowsToUpdate.push({
          id: existingId,
          image,
        });
        continue;
      }

      rowsToInsert.push({
        name: row.name,
        image,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (rowsToInsert.length > 0) {
      await queryInterface.bulkInsert("categories", rowsToInsert);
    }

    for (const row of rowsToUpdate) {
      await queryInterface.bulkUpdate(
        "categories",
        {
          image: row.image,
          updatedAt: now,
        },
        { id: row.id },
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("categories", {}, {});
  },
};
