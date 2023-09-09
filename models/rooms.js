'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  rooms.init({
    hostel_id: DataTypes.UUID,
    block_id: DataTypes.UUID,
    bedNo: DataTypes.INTEGER,
    matricNo: DataTypes.STRING,
    roomNo: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:"rooms",
    modelName: 'rooms',
  });
  return rooms;
};