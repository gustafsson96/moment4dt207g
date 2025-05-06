const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(process.env.DATABASE)

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

// Routes

app.get("/", (req, res) => {
    res.send("Welcome to this API :-)");
});

app.use("/api", authRoutes);

// Protected route that returns fun facts
app.get("/api/protected", authenticateToken, (req, res) => {
    const factsQuery = `SELECT * FROM funfacts`;

    db.all(factsQuery, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Failed to fetch fun facts." })
        }
        res.json({ funFacts: rows });
    });
});

// Validate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Token

    if (token == null) res.status(401).json({ message: "Not authorized for this route. Token missing." });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) return res.status(403).json({ message: "Invalid JWT." });

        req.username = username;
        next();
    })
}

// Start application
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})