import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Area extends Model {
    static associate(models) {}
  }
  Area.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
