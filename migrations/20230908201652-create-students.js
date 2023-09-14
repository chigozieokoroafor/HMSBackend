'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Datatypes) {
    await queryInterface.createTable('students', {
      matricNo: {
        allowNull: false,
        primaryKey: true,
        type: Datatypes.STRING
      },
      fullName: {
        allowNull: false,
        type: Datatypes.STRING
      },
      dept: {
        allowNull: false,
        type: Datatypes.STRING
      },
      faculty: {
        allowNull: false,
        type: Datatypes.STRING
      },
      part: {
        allowNull: false,
        type: Datatypes.INTEGER
      },
      password:{
        allowNull: false,
        type:Datatypes.STRING
      },
      room_id:{
        type:Datatypes.INTEGER,
        allowNull:true,
        defaultValue:0
      },
      createdAt: {
        allowNull: false,
        type: Datatypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Datatypes.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('students');
  }
};