const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');

// Синхронізація моделі з базою даних
Task.sync();
User.sync();

// Отримання всіх задач
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get tasks for a specific user
router.get('/user/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const tasks = await Task.findAll({ where: { user_id: user_id } });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Отримати задачу за ідентифікатором
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) throw Error('Task not found');
        res.json(task);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Створення нової задачі
router.post('/', async (req, res) => {
    try {
        const newTask = await Task.create(req.body);
        res.json(newTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Оновлення задачі
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (task) {
            await task.update(req.body);
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task Not Found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Видалення задачі
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (task) {
            await task.destroy();
            res.json({ message: 'Task Deleted' });
        } else {
            res.status(404).json({ message: 'Task Not Found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
