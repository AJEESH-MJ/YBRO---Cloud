import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";

// Configure env
dotenv.config();

// database config
connectDB();

// Create an Express app
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);

// Define a route
app.get("/", (req, res) => {
    res.send("Hello");
});

// Error handling middleware (Add it at the end)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
});

// PORT
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
