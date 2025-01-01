const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
// require('dotenv').config();

const JWT_SECRET ="fallbackSecretKey";

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Name must be at least 3 characters").isLength({ min: 3 }).trim().escape(),
    body("email", "Enter a valid email").isEmail().normalizeEmail(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }).trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, error: "A user with this email already exists" });
      }

      // Hash password before saving
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: secPass });
      await user.save();

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '1y' }); // Token expires in 1 year

      res.status(201).json({ success: true, authToken });
    } catch (err) {
      console.error("Error in createuser route:", err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail().normalizeEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log("Login failed: Email not found", email);
        return res.status(400).json({ success: false, error: "Invalid credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        console.log("Login failed: Password mismatch for email", email);
        return res.status(400).json({ success: false, error: "Invalid credentials" });
      }

      const data = { user: { id: user.id } };
      const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '1y' }); // Token expires in 1 year

      console.log("Login successful for email", email);
      res.json({ success: true, authToken });
    } catch (err) {
      console.error("Error during login:", err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


// ROUTE 3: Get logged-in User Details using: GET "/api/auth/getuser". Login required
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    // Ensure req.user is defined
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized access" });
    }

    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    // If user not found, return a 404 error
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Return the user details, excluding sensitive information
    res.json({ success: true, user });
  } catch (err) {
    console.error(`Error in /getuser route for userId=${req.user?.id}:`, err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
