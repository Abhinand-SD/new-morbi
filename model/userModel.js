const { default: mongoose } = require('mongoose')
const mongose = require('mongoose')

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
    password: {
        type: String,
        required: true
    },
    verificationCode: { 
        type: String 
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('user', userSchema)
