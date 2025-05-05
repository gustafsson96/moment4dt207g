require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

// Connect
const db = new sqlite3.Database(process.env.DATABASE);

// Create tables
db.serialize(() => {
    // Drop users table if it exists
    db.run("DROP TABLE IF EXISTS users");

    // Create users table
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Drop funfacts table if it exists
    db.run("DROP TABLE IF EXISTS funfacts");

    // Create funfacts table
    db.run(`CREATE TABLE funfacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fact TEXT NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert default facts
    const facts = [
        "Bananas are berries, but strawberries aren't.",
        "Octopuses have three hearts.",
        "Honey never spoils.",
        "You can't hum while holding your nose.",
        "Cats have fewer toes on their back paws."
    ];

    const stmt = db.prepare("INSERT INTO funfacts (fact) VALUES (?)");
    facts.forEach(fact => stmt.run(fact));
    stmt.finalize();

    console.log("Tables created and data inserted...");
});