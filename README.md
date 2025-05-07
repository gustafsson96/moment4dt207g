# Moment 4 DT207G Part 1

This project is part of Moment 4 -  *"Autentisering och säkerhet"* in the course Backend-baserad webbutveckling (DT207G) at Mittuniversitetet, Sundsvall. 

The API is a simple authentication system that uses JSON Web Tokens (JWT) and allows users to register, login and access a protected data route. The protected data route collects data with fun facts from the database.

## Features
* **User registration:** Allows users to create an account.
* **User login:** Authenticates users and returns a JWT.
* **Protected route:** A route that returns fun facts for authenticated users.
* **SQLite Database:** Stores user credentials and fun facts.

## API Endpoints

| Method     | End Point      | Description         |
|------------|----------------|---------------------|
| POST       | /api/register  | Registers a new user and returns a JWT.|
| POST       | /api/login     | Logs in an existing user and returns a JWT.|
| GET        | /api/protected | Fetches fun facts from the database. Requires a valid JWT.|

## Installation

Ensure node.js and SQLite3 are installed and then follow these steps:

1. Clone the repository: git clone https://github.com/gustafsson96/moment4dt207g.git
2. Navigate into the project folder: cd your-project-folder-name
3. Install necessary dependencies by running: npm install.
4. Create a .env file and add in your database credentials like this:
* PORT=
* DATABASE=
* JWT_SECRET_KEY=
5. Start the server by running: npm run serve





