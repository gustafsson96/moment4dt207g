/* Routes for authentication */
require("dotenv").config();
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

// Connect to database 
const db = new sqlite3.Database(process.env.DATABASE);

// Add a new user
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input (VIDAREUTVECKLA INNAN INLÄMNING, både validering och 400 meddelande)
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input. Insert username and password." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Check if user exists - på egen hand

        // Save user if input is correct
        const sql = `INSERT INTO users(username, password) VALUES(?,?)`;
        db.run(sql, [username, hashedPassword], (err) => {
            if (err) {
                res.status(400).json({ message: "Error creating user..." })
            } else {
                res.status(201).json({ message: "User created successfully." });
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// User login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input (VIDAREUTVECKLA INNAN INLÄMNING, både validering och 400 meddelande)
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input. Insert username and password." });
        }

        // Check credentials 

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
                    // Correct login
                    res.status(200).json({ message: "Correct login" });
                }
            }
        })

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;