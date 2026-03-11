import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      if (models.Testimonial) {
        User.hasMany(models.Testimonial, { foreignKey: "userId", as: "testimonials" });
      }
      if (models.Recipe) {
        User.hasMany(models.Recipe, { as: "authoredRecipes", foreignKey: "userId" });
      }
      if (models.Favorite) {
        User.hasMany(models.Favorite, { foreignKey: "userId", as: "favorites" });
      }
      if (models.Follow) {
        User.hasMany(models.Follow, { foreignKey: "followerId", as: "following" });
        User.hasMany(models.Follow, { foreignKey: "followingId", as: "followers" });
      }
    }
  }

  User.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      verify: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    },
  );

  return User;
};
