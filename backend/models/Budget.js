const mongoose = require('mongoose');
const { Schema } = mongoose;

const BudgetSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to the 'user' collection
        required: true, // Make it required if every budget entry must belong to a user
    },
    spendingType: { // Changed from Spend for better readability
        type: String,
        required: true,
    },
    category: { // Fixed typo in "catagory"
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('budget', BudgetSchema); // Changed model name from 'notes' to 'budget'
