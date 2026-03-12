"use strict";
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("recipes", "name", "title");
    await queryInterface.removeColumn("recipes", "servings");
    await queryInterface.addColumn("recipes", "thumbnail", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("recipes", "title", "name");
    await queryInterface.addColumn("recipes", "servings", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.removeColumn("recipes", "thumbnail");
  },
};
