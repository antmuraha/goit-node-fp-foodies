import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      if (models.Testimonial) {
        User.hasMany(models.Testimonial, {
          foreignKey: 'userId',
          as: 'testimonials',
        });
      }
      if (models.Recipe) {
        User.hasMany(models.Recipe, {
          as: 'authoredRecipes',
          foreignKey: 'userId',
        });
      }
      if (models.Favorite) {
        User.belongsToMany(models.Recipe, {
          through: models.Favorite,
          foreignKey: 'userId',
          otherKey: 'recipeId',
          as: 'favoriteRecipes',
        });
      }
      if (models.Follow) {
        User.belongsToMany(models.User, {
          through: models.Follow,
          foreignKey: 'followerId',
          otherKey: 'followingId',
          as: 'following',
        });
        User.belongsToMany(models.User, {
          through: models.Follow,
          foreignKey: 'followingId',
          otherKey: 'followerId',
          as: 'followers',
        });
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
      avatarURL: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'avatar',
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
      modelName: 'User',
      tableName: 'users',
    },
  );

  return User;
};
