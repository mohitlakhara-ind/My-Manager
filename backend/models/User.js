const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
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
    maxMonthlyBudget: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    },
    role: {
        type: String
    },
    skills: {
        type: [String]
    },
    contact: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
