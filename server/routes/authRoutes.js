const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");

require("dotenv").config(); // Load environment variables

// User Registration
router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("department", "Department is required").not().isEmpty(),
    check("role", "Invalid role").isIn(["Manager", "Operator"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role, department } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Hash Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ username, email, password: hashedPassword, role, department });

      await user.save();

      // Generate JWT Token
      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET || "your_default_secret", { expiresIn: "1h" });

      res.json({ token });
    } catch (err) {
      console.error("Error in register route:", err);
      res.status(500).json({ msg: "Server Error", error: err.message });
    }
  }
);

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);
    console.log("Password Hash Check:", user.password.startsWith("$2b$"));

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Generate JWT Token
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "your_default_secret", { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
