'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({hostels, rooms}) {
      // define association here
      // this.belongsTo(blocks,{ foreignKey:'hostel_id', as:"hostels"})
      // this.hasMany(rooms,{ foreignKey:'block_id', as:"rooms"})
    }
    toJSON(){
      return {
        ...this.get(),
        createdAt:undefined,
        updatedAt:undefined
      }
    }
  }
  blocks.init({
    bloc_id: {
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    label: {
      type:DataTypes.STRING,
      allowNull:false
    },
    hostel_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'blocks',
  });
  return blocks;
};