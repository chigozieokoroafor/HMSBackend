'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  admin.init({
    username: {
      type: DataTypes.STRING,
      allowNull:false
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false
    },
    superAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull:false
    },
    hostel: {
      type: DataTypes.STRING,
      allowNull:true
    }
  }, {
    sequelize,
    modelName: 'admin',
  });
  return admin;
};