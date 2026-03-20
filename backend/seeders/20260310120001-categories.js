"use strict";
import { loadCSV } from "../helpers/parseCSV.js";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const now = new Date();
    const rows = /** @type {Array<{ name: string; image?: string; description?: string }>} */ (
      loadCSV("categories.csv")
    );
    const [existingCategories] = /** @type {[Array<{ id: number; name: string }>, unknown]} */ (
      await queryInterface.sequelize.query("SELECT id, name FROM categories")
    );
    const existingCategoryIdByName = new Map(existingCategories.map((category) => [category.name, category.id]));

    const rowsToInsert = [];
    const rowsToUpdate = [];

    for (const row of rows) {
      const description = row.description || null;
      const image = row.image || null;
      const existingId = existingCategoryIdByName.get(row.name);

      if (existingId) {
        rowsToUpdate.push({
          id: existingId,
          description,
          image,
        });
        continue;
      }

      rowsToInsert.push({
        name: row.name,
        image,
        description,
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
          description: row.description,
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
