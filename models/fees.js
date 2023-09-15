'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  fees.init({
    hostel_id: DataTypes.UUID,
    fee: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'fees',
  });
  return fees;
};