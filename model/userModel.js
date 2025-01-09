const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        unique: true,    
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'user'
    },
    verificationCode: { 
        type: String 
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationExpires: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: { 
        type: Date
    }
});

module.exports = mongoose.model('user', userSchema);
