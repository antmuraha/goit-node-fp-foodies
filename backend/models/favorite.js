import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.User, { foreignKey: "userId" });
      Favorite.belongsTo(models.Recipe, { foreignKey: "recipeId" });
    }
  }

  Favorite.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Favorite",
      tableName: "favorites",
    },
  );

  return Favorite;
};
