"use strict";

import { loadCSV } from "../helpers/parseCSV.js";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const now = new Date();

    // --- lookup tables already seeded ---
    const [dbCategories] = await queryInterface.sequelize.query(
      "SELECT id, name FROM categories",
    );
    const categoryMap = Object.fromEntries(dbCategories.map((c) => [c.name, c.id]));

    const [dbAreas] = await queryInterface.sequelize.query(
      "SELECT id, name FROM areas",
    );
    const areaMap = Object.fromEntries(dbAreas.map((a) => [a.name, a.id]));

    const [dbUsers] = await queryInterface.sequelize.query(
      "SELECT id, email FROM users",
    );
    const userEmailMap = Object.fromEntries(dbUsers.map((u) => [u.email, u.id]));

    // Map CSV user string-id → DB integer id via email
    const csvUsers = loadCSV("users.csv");
    const csvUserIdToDbId = Object.fromEntries(
      csvUsers
        .filter((u) => userEmailMap[u.email] !== undefined)
        .map((u) => [u.id, userEmailMap[u.email]]),
    );

    // --- build recipe rows ---
    const csvRecipes = loadCSV("recipes.csv");

    await queryInterface.bulkInsert(
      "recipes",
      csvRecipes.map((r) => ({
        name: r.title,
        description: r.description || null,
        instructions: r.instructions || null,
        cookingTime: r.time ? parseInt(r.time, 10) || null : null,
        servings: null,
        image: r.thumb || null,
        categoryId: categoryMap[r.category] ?? null,
        userId: csvUserIdToDbId[r.owner_id] ?? null,
        createdAt: now,
        updatedAt: now,
      })),
      { ignoreDuplicates: true },
    );

    // --- recipeAreas ---
    const [dbRecipes] = await queryInterface.sequelize.query(
      "SELECT id, name FROM recipes",
    );
    const recipeTitleToDbId = Object.fromEntries(dbRecipes.map((r) => [r.name, r.id]));

    const recipeAreaRows = [];
    for (const r of csvRecipes) {
      if (!r.area) continue;
      const recipeId = recipeTitleToDbId[r.title];
      const areaId = areaMap[r.area];
      if (recipeId && areaId) {
        recipeAreaRows.push({ recipeId, areaId, createdAt: now, updatedAt: now });
      }
    }

    if (recipeAreaRows.length > 0) {
      await queryInterface.bulkInsert("recipeAreas", recipeAreaRows, {
        ignoreDuplicates: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("recipeAreas", null, {});
    await queryInterface.bulkDelete("recipes", null, {});
  },
};
