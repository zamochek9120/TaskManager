const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const session = require('express-session');


// User Registration
router.post('/register', async (req, res) => {
    console.log(`Register request received: ${JSON.stringify(req.body)}`);
    try {
        const existingUser = await User.findOne({ where: { username: req.body.username } });
        if (existingUser) {
            console.log(`Username already exists: ${req.body.username}`);
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            username: req.body.username,
            password: hashedPassword,
            role: "User"
        });

        // Після створення нового користувача
        req.session.user = { id: newUser.id, username: newUser.username, role: newUser.role };
        console.log(`Saving user to session: ${JSON.stringify(req.session.user)}`);

        console.log(`New user registered: ${newUser.username}`);
        res.status(201).json({ message: 'Register successful', user: newUser }); // Замінено 'user' на 'newUser'
    } catch (error) {
        console.error(`Error during registration: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});


// User Login
router.post('/login', async (req, res) => {
    console.log(`Login request received: ${JSON.stringify(req.body)}`);
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            console.log(`Login failed, user doesn't exist: ${req.body.username}`);
            return res.status(400).json({ message: `User doesn't exist!` });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            console.log(`Login failed, invalid password for user: ${req.body.username}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Зберігаємо користувача в сесію
        req.session.user = { id: user.id, username: user.username, role: user.role };

        console.log(`Login successful: ${user.username}`);
        res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error(`Error during login: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get current user from session
router.get('/current-user', (req, res) => {
    console.log('Session before responding:', req.session.user); // Додаткове логування
    if (req.session.user) {
        console.log(`User retrieved from session: ${JSON.stringify(req.session.user)}`);
        res.json(req.session.user);
    } else {
        console.log('No user is logged in');
        res.status(401).json({ message: 'No user is logged in' });
    }
});



module.exports = router;
