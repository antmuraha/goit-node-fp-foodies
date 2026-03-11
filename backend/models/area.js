import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Area extends Model {
    static associate(models) {
      if (models.RecipeArea) {
        Area.belongsToMany(models.Recipe, {
          through: models.RecipeArea,
          foreignKey: "areaId",
          otherKey: "recipeId",
        });
      }
    }
  }
  Area.init(
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
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Area",
      tableName: "areas",
    },
  );
  return Area;
};
