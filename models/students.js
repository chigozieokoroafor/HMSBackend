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
    static associate({rooms}) {
      // define association here
      this.belongsTo(rooms, { foreignKey:'matricNo', as:"room"})
    }
    
    toJSON(){
      return {
        ...this.get(),
        createdAt:undefined,
        updatedAt:undefined
      }
    }
  }
  
  students.init({
    matricNo: {
      type:DataTypes.STRING,
      allowNull:false,
      primaryKey:true,
      unique:true
    },
    firstName: {
      type:DataTypes.STRING,
      allowNull:false
    },
    dept: {
      type:DataTypes.STRING,
      allowNull:false
    },
    faculty: {
      type:DataTypes.STRING,
      allowNull:false
    },

    part: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'students',
  });
  return students;
};