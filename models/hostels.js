'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hostels extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({blocks, rooms, admin}) {
      // this.hasMany(blocks,{ foreignKey:'hostel_id', as:"blocks"})
      // this.hasMany(rooms,{ foreignKey:'hostel_id', as:"rooms"})
      // this.belongsTo(admin, {foreignKey:'org_id', as:"hostels"})
    }
    toJSON(){
      return {
        ...this.get(),
        createdAt:undefined,
        updatedAt:undefined
      }
    }
  }
  hostels.init({
    hostel_id: {
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      allowNull:false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull:false
    },
    name:{
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    org_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:1
      
    }
  }, {
    sequelize,
    modelName: 'hostels',
  });
  return hostels;
};