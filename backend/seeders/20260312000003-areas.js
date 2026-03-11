"use strict";

const areas = [
  { name: "American" },
  { name: "British" },
  { name: "Canadian" },
  { name: "Chinese" },
  { name: "Croatian" },
  { name: "Dutch" },
  { name: "Egyptian" },
  { name: "Filipino" },
  { name: "French" },
  { name: "Greek" },
  { name: "Indian" },
  { name: "Irish" },
  { name: "Italian" },
  { name: "Jamaican" },
  { name: "Japanese" },
  { name: "Kenyan" },
  { name: "Malaysian" },
  { name: "Mexican" },
  { name: "Moroccan" },
  { name: "Polish" },
  { name: "Portuguese" },
  { name: "ruzzian" },
  { name: "Spanish" },
  { name: "Thai" },
  { name: "Tunisian" },
  { name: "Turkish" },
  { name: "Ukrainian" },
  { name: "Unknown" },
  { name: "Vietnamese" },
];

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "areas",
      areas.map((a) => ({ ...a, createdAt: now, updatedAt: now })),
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("areas", null, {});
  },
};
