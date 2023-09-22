'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({students}) {
      // define association here
      // create an association here between the students and the rooms,
      // students hasone bed
      // 1 bed belongs to student
      // this.hasOne(students, {foreignKey:'matricNo', as:"student"})
      // this.belongsTo(students,{foreignKey:'room_id', as:'room'})
      // as:"room" sets an alias which can be used when fetching users
    }
    toJSON(){
      return {
        ...this.get(),
        createdAt:undefined,
        updatedAt:undefined
      }
    }
  }
  rooms.init({
    hostel_id: DataTypes.INTEGER,
    block: DataTypes.INTEGER,
    bedNo: DataTypes.INTEGER,
    matricNo: {
      type:DataTypes.STRING,
      defaultValue:""
    },
    roomNo: DataTypes.INTEGER,

    status:{
      type:DataTypes.INTEGER,
      defaultValue:1
    },
    room_id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      allowNull: false,
    },
    users_paid:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    gender:{
      type:DataTypes.STRING,
      allowNull:false
    },
    org_id:{
      type:DataTypes.INTEGER, 
      allowNull:false
    },
    programType:{
      type:DataTypes.CHAR(1),
      allowNull:false
    },
    allocated:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    }
  }, {
    sequelize,
    tableName:"rooms",
    modelName: 'rooms',
  });
  return rooms;
};