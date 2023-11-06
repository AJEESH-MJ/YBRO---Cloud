  import userModel from "../models/userModel.js";
  import { comparePassword, hashPassword } from "../helpers/authHelper.js";
  import JWT from "jsonwebtoken";

  export const registerController = async (req, res) => {
    try {
      const { userName, email, password, securityQuestion, securityAnswer } = req.body;
      // Validations
      if (!userName) return res.status(400).json({ msg: "Name is required" });
      if (!email) return res.status(400).json({ msg: "Email is required" });
      if (!password) return res.status(400).json({ msg: "Password is required" });
      if (!securityQuestion) return res.status(400).json({ msg: "Security Question is required" });
      if (!securityAnswer) return res.status(400).json({ msg: "Security Answer is required" });

      // Check user
      const existingUser = await userModel.findOne({ userName });

      // If user exists
      if (existingUser) {
        return res
          .status(409)
          .json({
            success: false,
            msg: "User already exists, please login to continue.",
          });
      }

      // Register user
      const hashedPassword = await hashPassword(password);

      // Save user to the database
      const newUser = await new userModel({
        userName,
        email,
        password: hashedPassword,
        securityQuestion,
        securityAnswer,
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
      if (!userName || !password)
        return res
          .status(400)
          .json({ success: false, msg: "Invalid UserName or Password" });

      // Check user
      const user = await userModel.findOne({ userName });
      if (!user)
        return res
          .status(400)
          .json({ success: false, msg: "UserName doesn't exists." });

      // Check password
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ success: false, msg: "Incorrect password" });

      // Return token
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.status(200).send({
        success: true,
        msg: "Login successful",
        user: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  };

  //forgot password
  export const forgotPasswordController = async (req, res) => {
    const compareSecurityAnswer = (providedAnswer, storedAnswer) => {
      // Convert both answers to lowercase for case-insensitive comparison
      const providedAnswerLower = providedAnswer.toLowerCase();
      const storedAnswerLower = storedAnswer.toLowerCase();
    
      // Compare the lowercase answers
      return providedAnswerLower === storedAnswerLower;
    };
    
    try {
      const { email, securityQuestion, securityAnswer, newPassword } = req.body;
      // Validations
      if (!email) {
        return res.status(400).json({ success: false, msg: "Email is required" });
      }
      if (!securityQuestion) {
        return res.status(400).json({ success: false, msg: "Security Question is required" });
      }
      if (!securityAnswer) {
        return res.status(400).json({ success: false, msg: "Security Answer is required" });
      }
      if (!newPassword) {
        return res.status(400).json({ success: false, msg: "New password is required" });
      }

      // Check user
      const user = await userModel.findOne({ email, securityQuestion });

      // If user exists
      if (!user) {
        return res.status(400).json({ success: false, msg: "Invalid credentials" });
      }

      // Check if the security answer matches
      const isSecurityAnswerMatch = await compareSecurityAnswer(
        securityAnswer,
        user.securityAnswer
      );

      if (!isSecurityAnswerMatch) {
        return res.status(400).json({ success: false, msg: "Invalid security answer" });
      }

      // If security answer is correct, update the password
      const hashed = await hashPassword(newPassword);
      await userModel.findByIdAndUpdate(user._id, { password: hashed });
      return res.status(200).json({ success: true, msg: "Password updated successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  };


  //test controller
  export const testController = async (req, res) => {
    try {
      res.status(200).json({ success: true, msg: "Test controller success" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  };
