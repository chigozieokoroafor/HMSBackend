'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Datatypes) {
    await queryInterface.createTable('rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Datatypes.INTEGER
      },
      hostel_id: {
        type: Datatypes.STRING
      },
      block_id: {
        type: Datatypes.STRING
      },
      bedNo: {
        type: Datatypes.INTEGER
      },
      matricNo: {
        type: Datatypes.STRING
      },
      roomNo: {
        type: Datatypes.STRING
      },
      status:{
        type:Datatypes.STRING,
        defaultValue:"available"
      },
      users_paid:{
        type:Datatypes.BOOLEAN,
        defaultValue:false
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
    await queryInterface.dropTable('rooms');
  }
};