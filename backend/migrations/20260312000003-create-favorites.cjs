"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("favorites", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      recipeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "recipes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("favorites", ["userId"]);
    await queryInterface.addIndex("favorites", ["recipeId"]);
    await queryInterface.addIndex("favorites", ["userId", "recipeId"], {
      unique: true,
      name: "favorites_user_recipe_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("favorites");
  },
};
