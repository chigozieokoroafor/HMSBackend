'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Datatypes) {
    await queryInterface.createTable('hostels', {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: Datatypes.INTEGER
      // },
      uuid: {
        type: Datatypes.UUID,
        primaryKey:true
      },
      gender: {
        type: Datatypes.STRING
      },
      name:{
        type:Datatypes.STRING,
        allowNull:false,
        unique:true
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
    await queryInterface.dropTable('hostels');
  }
};