const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../database/tasks.db' // Шлях до файлу бази даних
});

module.exports = sequelize;
