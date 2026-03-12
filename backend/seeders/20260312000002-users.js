"use strict";

import bcrypt from "bcrypt";
import { loadCSV } from "../helpers/parseCSV.js";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const seedPassword = process.env.SEED_PASSWORD;
    if (!seedPassword) {
      throw new Error(
        "SEED_PASSWORD environment variable is required to run the users seeder.",
      );
    }

    const now = new Date();
    const rows = loadCSV("users.csv");

    const password = await bcrypt.hash(seedPassword, 10);

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
