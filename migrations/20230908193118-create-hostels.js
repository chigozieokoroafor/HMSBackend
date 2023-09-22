'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Datatypes) {
    await queryInterface.createTable('hostels', {
      
      hostel_id: {
        type: Datatypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
      },
      gender: {
        type: Datatypes.STRING
      },
      name:{
        type:Datatypes.STRING,
        allowNull:false,
        unique:true
      },
      org_id:{
        type:Datatypes.INTEGER,
        allowNull:false
        
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