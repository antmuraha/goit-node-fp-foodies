

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    const now = new Date();

    const [categories] = await queryInterface.sequelize.query("SELECT id, name FROM categories ORDER BY name ASC");
    if (categories.length === 0) return;

    const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));

    const [areas] = await queryInterface.sequelize.query("SELECT id, name FROM areas ORDER BY name ASC");
    const areaMap = Object.fromEntries(areas.map((a) => [a.name, a.id]));

    const recipes = [
      {
        name: "Spaghetti Bolognese",
        description: "A classic Italian meat sauce pasta dish.",
        instructions:
          "1. Brown minced beef. 2. Add onion, garlic, and tomatoes. 3. Simmer for 30 minutes. 4. Serve over spaghetti.",
        cookingTime: 45,
        servings: 4,
        image: null,
        categoryId: categoryMap["Pasta"] ?? null,
        userId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Chicken Tikka Masala",
        description: "Chunks of grilled chicken in a rich, spiced tomato cream sauce.",
        instructions:
          "1. Marinate chicken in yogurt and spices. 2. Grill until charred. 3. Simmer in tomato cream sauce. 4. Serve with rice.",
        cookingTime: 60,
        servings: 4,
        image: null,
        categoryId: categoryMap["Chicken"] ?? null,
        userId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Beef Stew",
        description: "A hearty slow-cooked beef stew with vegetables.",
        instructions:
          "1. Brown beef chunks. 2. Add vegetables and broth. 3. Slow cook for 2 hours. 4. Season and serve.",
        cookingTime: 140,
        servings: 6,
        image: null,
        categoryId: categoryMap["Beef"] ?? null,
        userId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Pancakes",
        description: "Fluffy American-style breakfast pancakes.",
        instructions:
          "1. Mix flour, egg, milk, and butter. 2. Pour batter onto hot griddle. 3. Cook until bubbles form, flip, and cook 1 more minute.",
        cookingTime: 20,
        servings: 2,
        image: null,
        categoryId: categoryMap["Breakfast"] ?? null,
        userId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Chocolate Lava Cake",
        description: "Decadent chocolate cake with a molten centre.",
        instructions:
          "1. Melt chocolate and butter. 2. Whisk in eggs and sugar. 3. Fold in flour. 4. Bake at 220°C for 12 minutes.",
        cookingTime: 25,
        servings: 4,
        image: null,
        categoryId: categoryMap["Desserts"] ?? null,
        userId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Vegetable Stir Fry",
        description: "Quick and colourful stir-fried vegetables with soy sauce.",
        instructions:
          "1. Heat oil in wok. 2. Add vegetables in order of density. 3. Add soy sauce and sesame oil. 4. Serve immediately.",
        cookingTime: 15,
        servings: 2,
        image: null,
        categoryId: categoryMap["Vegan"] ?? null,
        userId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Lamb Tagine",
        description: "Slow-cooked Moroccan lamb with apricots and spices.",
        instructions:
          "1. Brown lamb. 2. Add onions, spices, and stock. 3. Cook in tagine for 2 hours. 4. Add apricots in final 30 minutes.",
        cookingTime: 150,
        servings: 4,
        image: null,
        categoryId: categoryMap["Lamb"] ?? null,
        userId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Prawn Stir Fry",
        description: "Juicy prawns stir-fried with garlic and ginger.",
        instructions:
          "1. Heat oil. 2. Fry garlic and ginger. 3. Add prawns and cook 3 minutes. 4. Toss with sauce and serve.",
        cookingTime: 15,
        servings: 2,
        image: null,
        categoryId: categoryMap["Seafood"] ?? null,
        userId: null,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("recipes", recipes);

    if (Object.keys(areaMap).length > 0) {
      const [insertedRecipes] = await queryInterface.sequelize.query("SELECT id, name FROM recipes ORDER BY id ASC");

      const recipeAreaRows = [];
      const recipeAreas = [
        { recipeName: "Spaghetti Bolognese", areaName: "Italian" },
        { recipeName: "Chicken Tikka Masala", areaName: "Indian" },
        { recipeName: "Beef Stew", areaName: "British" },
        { recipeName: "Pancakes", areaName: "American" },
        { recipeName: "Lamb Tagine", areaName: "Moroccan" },
      ];

      for (const { recipeName, areaName } of recipeAreas) {
        const recipe = insertedRecipes.find((r) => r.name === recipeName);
        const areaId = areaMap[areaName];
        if (recipe && areaId) {
          recipeAreaRows.push({
            recipeId: recipe.id,
            areaId,
            createdAt: now,
            updatedAt: now,
          });
        }
      }

      if (recipeAreaRows.length > 0) {
        await queryInterface.bulkInsert("recipeAreas", recipeAreaRows);
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("recipeAreas", null, {});
    await queryInterface.bulkDelete("recipes", null, {});
  },
};
