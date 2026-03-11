import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Ingredient extends Model {
    static associate(models) {
      if (models.RecipeIngredient) {
        Ingredient.hasMany(models.RecipeIngredient, { foreignKey: "ingredientId" });
      }
    }
  }
  Ingredient.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Ingredient",
      tableName: "ingredients",
    },
  );
  return Ingredient;
};
