'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbc_usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull:false
      },
      direccion: {
        type: Sequelize.STRING(200),
         allowNull:false
      },
      telefono: {
        type: Sequelize.STRING(15),
         allowNull:false
      },
      email: {
        type: Sequelize.STRING(120),
         allowNull:false
      },
      password: {
        type: Sequelize.STRING(255),
         allowNull:false
      },
      rol: {
        type: Sequelize.ENUM('admin', 'cliente'),
        allowNull:false,
        defaultValue: 'cliente'
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbc_usuarios');
  }
};