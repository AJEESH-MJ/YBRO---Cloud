import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Configure env
dotenv.config();

// database config
connectDB();

// Create an Express app
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

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
