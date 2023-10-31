import express from "express";
import dotenv from "dotenv";

// Configure env
dotenv.config();

// Create an Express app
const app = express();

// Define a route
app.get("/", (req, res) => {
    res.send("Welcome");
});

// PORT
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
