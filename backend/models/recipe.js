import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      Recipe.belongsTo(models.Category, { foreignKey: "categoryId" });
      Recipe.belongsTo(models.User, { as: "author", foreignKey: "userId" });
      Recipe.belongsToMany(models.Ingredient, {
        through: models.RecipeIngredient,
        foreignKey: "recipeId",
        otherKey: "ingredientId",
      });
      Recipe.belongsToMany(models.Area, {
        through: models.RecipeArea,
        foreignKey: "recipeId",
        otherKey: "areaId",
      });
      Recipe.belongsToMany(models.User, {
        through: models.Favorite, 
        foreignKey: "recipeId", 
        otherKey: "userId",
        as: "favoritedBy"
      })
    }
  }

  Recipe.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cookingTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thumbnail: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Recipe",
      tableName: "recipes",
    },
  );

  return Recipe;
};
