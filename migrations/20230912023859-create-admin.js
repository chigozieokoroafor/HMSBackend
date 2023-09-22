'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
      }, 
      email:{
        type:DataTypes.STRING,
        allowNull:false
      }, 
      org_id:{
        type: DataTypes.INTEGER,
        allowNull:false
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
    await queryInterface.dropTable('admins');
  }
};