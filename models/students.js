'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class students extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  students.init({
    matricNo: {
      type:DataTypes.STRING,
      allowNull:false,
      primaryKey:true,
      unique:true
    },
    firstName: DataTypes.STRING,
    dept: DataTypes.STRING,
    faculty: DataTypes.STRING,
    part: DataTypes.INTEGER,
    password:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'students',
  });
  return students;
};