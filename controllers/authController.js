import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    // Validations
    if (!userName) return res.status(400).json({ msg: "Name is required" });
    if (!email) return res.status(400).json({ msg: "Email is required" });
    if (!password) return res.status(400).json({ msg: "Password is required" });

    // Check user
    const existingUser = await userModel.findOne({ userName });

    // If user exists
    if (existingUser) {
      return res.status(409).json({ success: false, msg: "User already exists, please login to continue." });

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
    return res
      .status(201)
      .json({ success: true, msg: "User registered successfully", newUser });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

//post login
export const loginController = async (req, res) => {
  try {
    const { userName, password } = req.body;
    // Validations
    if(!userName || !password) return res.status(400).json({ success:false, msg: "Invalid UserName or Password" });

    // Check user
    const user = await userModel.findOne({ userName });
    if(!user) return res.status(400).json({ success:false, msg: "UserName doesn't exists." });

    // Check password
    const isMatch = await comparePassword(password, user.password);
    if(!isMatch) return res.status(400).json({ success:false, msg: "Incorrect password" });

    // Return token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).send({
        success: true,
        msg: "Login successful",
        user: {
            userName: user.userName,
            email: user.email,
        },
        token,
    });
  } catch (error) {
    return res.status(500).json({ success:false, msg: error.message });
  }
};

//test controller
export const testController = async (req, res) => {
  try {
    res.status(200).json({ success: true, msg: "Test controller success" });
  } catch (error) {
    return res.status(500).json({ success:false, msg: error.message });
  }
};