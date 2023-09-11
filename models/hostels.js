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
    static associate({blocks, rooms}) {
      this.hasMany(blocks,{ foreignKey:'hostel_id', as:"blocks"})
      this.hasMany(rooms,{ foreignKey:'hostel_id', as:"rooms"})
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
    uuid: {
      type:DataTypes.UUID,
      primaryKey:true
    },
    gender: {
      type: DataTypes.STRING,
      allowNull:false
    },
    name:{
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'hostels',
  });
  return hostels;
};