import userModel from "../models/userModel.js";
import { hashPassword } from "../helpers/authHelper.js";

export const registerController = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        // Validations
        if (!userName) return res.status(400).json({ msg: "Name is required" });
        if (!email) return res.status(400).json({ msg: "Email is required" });
        if (!password) return res.status(400).json({ msg: "Password is required" });

        // Check user
        const existingUser = await userModel.findOne({ email });

        // If user exists
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists, please login to continue." });
        }

        // Register user
        const hashedPassword = await hashPassword(password);

        // Save user to the database
        const newUser = await new userModel({
            userName,
            email,
            password: hashedPassword,
        }).save();

        // Return response
        return res.status(201).json({ success: true, msg: "User registered successfully", newUser });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};
