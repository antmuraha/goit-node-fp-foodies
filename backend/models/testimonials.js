import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Testimonial extends Model {
    static associate(models) {
      if (models.User) {
        Testimonial.belongsTo(models.User, { foreignKey: "userId", as: "owner" });
      }
    }
  }
  Testimonial.init(
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Testimonial",
      tableName: "testimonials",
    },
  );
  return Testimonial;
};
