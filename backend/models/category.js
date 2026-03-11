import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      if (models.Recipe) {
        Category.hasMany(models.Recipe, { foreignKey: "categoryId" });
      }
    }
  }

  Category.init(
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
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
    },
  );

  return Category;
};
