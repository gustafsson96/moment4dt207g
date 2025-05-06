/* Routes for authentication */
require("dotenv").config();
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Connect to database 
const db = new sqlite3.Database(process.env.DATABASE);

// Add a new user
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate user input by ensuring username is a string and at least 3 characters
        if (typeof username !== "string" || username.trim().length < 3) {
            return res.status(400).json({ error: "Username must be at least 3 characters long." });
        }

        // Validate user input by ensuring password is a string and at least 6 characters
        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long." });
        }

        // Check if user already exists
        const checkUser = `SELECT * FROM users WHERE username = ?`;
        db.get(checkUser, [username], async (err, row) => {
            if (err) {
                return res.status(500).json({ message: "Database error." });
            }

            if (row) {
                return res.status(409).json({ message: "User already exists. Pick a different username." })
            }

            // If user does not exist, proceed to create
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const insertUser = `INSERT INTO users(username, password) VALUES(?,?)`;
            db.run(insertUser, [username.trim(), hashedPassword], (err) => {
                if (err) {
                    return res.status(400).json({ message: "Error creating user..." })
                } else {
                    // Create JWT
                    const payload = { username: username };
                    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
                    res.status(200).json({
                        message: "User logged in!",
                        token: token
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// User login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate user input by ensuring username is a string and at least 3 characters
        if (typeof username !== "string" || username.trim().length < 3) {
            return res.status(400).json({ error: "Username must be at least 3 characters long." });
        }

        // Validate user input by ensuring password is a string and at least 6 characters
        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long." });
        }

        // Check if user exists
        const sql = `SELECT * FROM users WHERE username=?`
        db.get(sql, [username], async (err, row) => {
            if (err) {
                res.status(400).json({ message: "Error authenticating" });
            } else if (!row) {
                res.status(401).json({ message: "Incorrect username or password" });
            } else {
                // User exists - check username and password
                const passwordMatch = await bcrypt.compare(password, row.password);

                if (!passwordMatch) {
                    res.status(401).json({ message: "Incorrect username or password" });
                } else {
                    // Create JWT
                    const payload = { username: username };
                    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
                    res.status(200).json({
                        message: "User logged in!",
                        token: token
                    });
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;