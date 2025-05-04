/* Routes for authentication */

const express = require("express");
const router = express.Router();

// Add a new user
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input (VIDAREUTVECKLA INNAN INLÄMNING, både validering och 400 meddelande)
        if (!username || !password ) {
            return res.status(400).json({ error: "Invalid input. Insert username and password."});
        }

        // If ok - save user 
        res.status(201).json({ message: "User created successfully."});
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// User login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input (VIDAREUTVECKLA INNAN INLÄMNING, både validering och 400 meddelande)
        if (!username || !password ) {
            return res.status(400).json({ error: "Invalid input. Insert username and password."});
        }

        // Check credentials 
        if(username === "julia" && password === "password") {
            res.status(200).json({ message: "Login successful"});
        } else {
            res.status(401).json({ error: "Invalid username/password"});
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;