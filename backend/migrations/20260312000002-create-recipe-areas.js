"use strict";
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("recipeAreas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      recipeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "recipes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      areaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "areas", key: "id" },
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

    await queryInterface.addIndex("recipeAreas", ["recipeId"]);
    await queryInterface.addIndex("recipeAreas", ["areaId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("recipeAreas");
  },
};
