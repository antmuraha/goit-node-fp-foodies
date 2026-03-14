"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("ingredients", "description", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TABLE "ingredients" ALTER COLUMN "description" TYPE VARCHAR(255) USING LEFT("description", 255)',
    );
    await queryInterface.changeColumn("ingredients", "description", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
