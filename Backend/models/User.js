// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Define the User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure usernames are unique
        trim: true // Remove whitespace from both ends of a string
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure emails are unique
        trim: true,
        lowercase: true, // Store emails in lowercase
        match: [/.+@.+\..+/, 'Please enter a valid email address'] // Basic email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Minimum password length
    },
    role: { // Optional: You might want roles like 'student', 'teacher', 'admin'
        type: String,
        enum: ['student', 'teacher', 'admin'], // Define allowed roles
        default: 'student' // Default role for new registrations
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set creation date
    }
});

// Pre-save hook to hash the password before saving a new user or updating password
UserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the generated salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err); // Pass error to the next middleware
    }
});

// Method to compare entered password with hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    // Compare the entered password with the hashed password
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
module.exports = mongoose.model('User', UserSchema);
