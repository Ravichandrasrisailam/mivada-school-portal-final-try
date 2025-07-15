// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For password comparison
const jwt = require('jsonwebtoken'); // For creating JWT tokens
const User = require('../models/User'); // Corrected path to User model

// Load environment variables (for JWT secret)
require('dotenv').config();

// Get JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("Error: JWT_SECRET not found in environment variables. Please set it in your .env file.");
    process.exit(1); // Exit if secret is not defined
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }

    try {
        // Check if user already exists by email or username
        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ msg: 'User with that email already exists' });
        }
        let userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ msg: 'User with that username already exists' });
        }

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password, // Password will be hashed by the pre-save hook in User model
            role: role || 'student' // Assign role, default to 'student' if not provided
        });

        // Save the user to the database
        await newUser.save();

        // Create JWT payload
        const payload = {
            user: {
                id: newUser.id, // MongoDB's _id is accessible as .id
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        };

        // Sign the token
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    msg: 'User registered successfully',
                    token,
                    user: payload.user // Send user details back
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // Check if user exists by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Validate password
        const isMatch = await user.matchPassword(password); // Using the method defined in User model
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        };

        // Sign the token
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({
                    msg: 'Logged in successfully',
                    token,
                    user: payload.user // Send user details back
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

