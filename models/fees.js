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
    hostel_id: DataTypes.INTEGER,
    fee: DataTypes.FLOAT,
    org_id:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'fees',
  });
  return fees;
};