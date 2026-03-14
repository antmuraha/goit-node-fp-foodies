"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("follows", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      followerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      followingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
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

    await queryInterface.addIndex("follows", ["followerId"]);
    await queryInterface.addIndex("follows", ["followingId"]);
    await queryInterface.addIndex("follows", ["followerId", "followingId"], {
      unique: true,
      name: "follows_follower_following_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("follows");
  },
};
