"use strict";
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("ingredients", "name", {
      type: Sequelize.STRING(200),
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("ingredients", "name", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });
  },
};
