'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class organizations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  organizations.init({
    name: {
      type:DataTypes.STRING,
      unique:true,
      allowNull:false
    },
    org_id: {
      type:DataTypes.INTEGER,
      primaryKey:true,
      allowNull:false,
      autoIncrement:true
    }
  }, {
    sequelize,
    modelName: 'organizations',
  });
  return organizations;
};