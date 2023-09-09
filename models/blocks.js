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
    static associate(models) {
      // define association here
    }
  }
  blocks.init({
    uuid: {
      type:DataTypes.UUID,
      primaryKey:true
    },
    label: {
      type:DataTypes.STRING,
      allowNull:false
    },
    hostel_id: {
      type:DataTypes.UUID,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'blocks',
  });
  return blocks;
};