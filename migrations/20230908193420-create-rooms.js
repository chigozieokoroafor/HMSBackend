'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('rooms', {
      room_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      hostel_id: {
        type: DataTypes.STRING
      },
      block: {
        type: DataTypes.STRING
      },
      org_id:{
        type:DataTypes.INTEGER, 
        allowNull:false
      },
      bedNo: {
        type: DataTypes.INTEGER
      },
      matricNo: {
        type: DataTypes.STRING
      },
      roomNo: {
        type: DataTypes.INTEGER
      },
      status:{
        type:DataTypes.INTEGER,
        defaultValue:1
      },
      users_paid:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
      },
      programType:{
        type:DataTypes.CHAR(1),
      },
      gender:{
        type : DataTypes.STRING,
        allowNull:false
      },
      allocated:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rooms');
  }
};