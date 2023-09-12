'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Datatypes) {
    await queryInterface.createTable('blocks', {
      uuid: {
        type: Datatypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      label: {
        type: Datatypes.STRING
      },
      hostel_id: {
        type: Datatypes.UUID,
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