'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Datatypes) {
    await queryInterface.createTable('blocks', {
      block_id: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement:true
      },
      label: {
        type: Datatypes.STRING
      },
      hostel_id: {
        type: Datatypes.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('blocks');
  }
};