'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Literatures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      user:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"Users",
          key:"id"
        },
        onUpdate:"cascade",
        onDelete:"cascade"
      },
      category:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"Categories",
          key:"id"
        },
        onUpdate:"cascade",
        onDelete:"cascade"
      },
      author: {
        type: Sequelize.STRING
      },
      publication: {
        type: Sequelize.INTEGER
      },
      pages: {
        type: Sequelize.INTEGER
      },
      ISBN: {
        type: Sequelize.INTEGER
      },
      status:{
        type:Sequelize.STRING
      },
      cover:{
        type:Sequelize.STRING
      },
      attachment: {
        type: Sequelize.STRING
      },
      description:{
        type:Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Literatures');
  }
};