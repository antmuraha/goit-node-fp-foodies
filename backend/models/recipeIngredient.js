import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class RecipeIngredient extends Model {
    static associate(models) {
      RecipeIngredient.belongsTo(models.Recipe, { foreignKey: "recipeId" });
      RecipeIngredient.belongsTo(models.Ingredient, { foreignKey: "ingredientId" });
    }
  }

  RecipeIngredient.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ingredientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "RecipeIngredient",
      tableName: "recipeIngredients",
    },
  );

  return RecipeIngredient;
};
