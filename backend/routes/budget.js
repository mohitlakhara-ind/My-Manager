const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Budget = require('../models/Budget'); // Updated model import
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All Budget Entries using: GET "/api/budget/fetchallbudgets". Login required
router.get('/fetchallbudgets', fetchuser, async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id }); // Fetch budgets for the logged-in user
        res.json(budgets);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Add a new Budget Entry using: POST "/api/budget/addbudget". Login required
router.post('/addbudget', fetchuser, [
    body('spendingType', 'Spending type is required').isString().notEmpty(),
    body('category', 'Category is required').isString().notEmpty(),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
    body('value', 'Value must be a positive number').isFloat({ gt: 0 })
], async (req, res) => {
    try {
        const { spendingType, category, description, value } = req.body;

        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create a new budget entry
        const budget = new Budget({
            spendingType,
            category,
            description,
            value,
            user: req.user.id
        });
        const savedBudget = await budget.save();

        res.json(savedBudget);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Update an existing Budget Entry using: PUT "/api/budget/updatebudget/:id". Login required
router.put('/updatebudget/:id', fetchuser, async (req, res) => {
    const { spendingType, category, description, value } = req.body;
    try {
        // Create an updatedBudget object
        const updatedBudget = {};
        if (spendingType) updatedBudget.spendingType = spendingType;
        if (category) updatedBudget.category = category;
        if (description) updatedBudget.description = description;
        if (value) updatedBudget.value = value;

        // Find the budget entry to update
        let budget = await Budget.findById(req.params.id);
        if (!budget) {
            return res.status(404).send("Not Found");
        }

        // Check if the logged-in user owns this budget entry
        if (budget.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Update the budget entry
        budget = await Budget.findByIdAndUpdate(req.params.id, { $set: updatedBudget }, { new: true });
        res.json({ budget });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 4: Delete an existing Budget Entry using: DELETE "/api/budget/deletebudget/:id". Login required
router.delete('/deletebudget/:id', fetchuser, async (req, res) => {
    try {
        // Find the budget entry to delete
        let budget = await Budget.findById(req.params.id);
        if (!budget) {
            return res.status(404).send("Not Found");
        }

        // Check if the logged-in user owns this budget entry
        if (budget.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Delete the budget entry
        budget = await Budget.findByIdAndDelete(req.params.id);
        res.json({ success: "Budget entry has been deleted", budget });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
