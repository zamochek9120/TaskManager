const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const session = require('express-session');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Налаштування сесій
app.use(session({
    secret: '140_V', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Термін дії кукі — 1 день
    }
}));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Підключення до бази даних
sequelize.authenticate()
    .then(() => console.log('SQLite Connected'))
    .catch(err => console.log('Error: ' + err));

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
