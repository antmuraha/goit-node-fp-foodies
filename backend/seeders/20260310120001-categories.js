const categories = [
  { name: "Beef", image: null },
  { name: "Breakfast", image: null },
  { name: "Chicken", image: null },
  { name: "Desserts", image: null },
  { name: "Goat", image: null },
  { name: "Lamb", image: null },
  { name: "Miscellaneous", image: null },
  { name: "Pasta", image: null },
  { name: "Pork", image: null },
  { name: "Seafood", image: null },
  { name: "Side", image: null },
  { name: "Starter", image: null },
  { name: "Vegan", image: null },
  { name: "Vegetarian", image: null },
];

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "categories",
      categories.map((c) => ({ ...c, createdAt: now, updatedAt: now })),
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
