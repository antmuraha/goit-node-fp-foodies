'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("areas", "name", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("areas", "name", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });
  },
}; 