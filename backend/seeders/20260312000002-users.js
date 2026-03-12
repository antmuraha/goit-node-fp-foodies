"use strict";

import bcrypt from "bcrypt";
import { loadCSV } from "../helpers/parseCSV.js";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const now = new Date();
    const rows = loadCSV("users.csv");

    // All sample users share the same default password for development
    const password = await bcrypt.hash("Password1!", 10);

    await queryInterface.bulkInsert(
      "users",
      rows.map((r) => ({
        name: r.name,
        email: r.email,
        password,
        avatar: r.avatar || null,
        token: null,
        verify: true,
        createdAt: now,
        updatedAt: now,
      })),
      { ignoreDuplicates: true },
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
