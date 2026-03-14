"use strict";

import { loadCSV } from "../helpers/parseCSV.js";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // Build CSV string-id → DB integer-id map for ingredients
    const csvIngredients = loadCSV("ingredients.csv");
    const [dbIngredients] = await queryInterface.sequelize.query("SELECT id, name FROM ingredients");
    const ingredientNameToDbId = Object.fromEntries(dbIngredients.map((i) => [i.name, i.id]));
    const csvIngredientIdToDbId = Object.fromEntries(
      csvIngredients
        .filter((i) => ingredientNameToDbId[i.name] !== undefined)
        .map((i) => [i.id, ingredientNameToDbId[i.name]]),
    );

    // Build CSV string-id → DB integer-id map for recipes
    const csvRecipes = loadCSV("recipes.csv");
    const [dbRecipes] = await queryInterface.sequelize.query("SELECT id, title FROM recipes");
    const recipeTitleToDbId = Object.fromEntries(dbRecipes.map((r) => [r.title, r.id]));
    const csvRecipeIdToDbId = Object.fromEntries(
      csvRecipes.filter((r) => recipeTitleToDbId[r.title] !== undefined).map((r) => [r.id, recipeTitleToDbId[r.title]]),
    );

    // Build recipeIngredients rows
    const csvRecipeIngredients = loadCSV("recipe_ingredients.csv");
    const rows = [];

    for (const ri of csvRecipeIngredients) {
      const recipeId = csvRecipeIdToDbId[ri.recipe_id];
      const ingredientId = csvIngredientIdToDbId[ri.ingredient_id];
      if (!recipeId || !ingredientId) continue;
      rows.push({
        recipeId,
        ingredientId,
        quantity: ri.measure || null,
        unit: null,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (rows.length > 0) {
      await queryInterface.bulkInsert("recipeIngredients", rows, {
        ignoreDuplicates: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("recipeIngredients", null, {});
  },
};
