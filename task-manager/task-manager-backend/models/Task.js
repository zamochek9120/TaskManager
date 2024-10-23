// models/Task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // або назва таблиці користувачів у вашій базі даних
            key: 'user_id'
        }
    }
}, {
    timestamps: false, // Вимкнути автоматичну генерацію полів createdAt та updatedAt
});

Task.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Task, { foreignKey: 'user_id' });

module.exports = Task;
