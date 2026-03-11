import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Follow extends Model {
    static associate(models) {
      Follow.belongsTo(models.User, { as: "follower", foreignKey: "followerId" });
      Follow.belongsTo(models.User, { as: "following", foreignKey: "followingId" });
    }
  }

  Follow.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Follow",
      tableName: "follows",
    },
  );

  return Follow;
};
