import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class RecipeArea extends Model {
    static associate(models) {
      RecipeArea.belongsTo(models.Recipe, { foreignKey: "recipeId" });
      RecipeArea.belongsTo(models.Area, { foreignKey: "areaId" });
    }
  }

  RecipeArea.init(
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
      areaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RecipeArea",
      tableName: "recipeAreas",
    },
  );

  return RecipeArea;
};
