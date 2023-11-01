import express from "express";
import { loginController, registerController } from "../controllers/authController.js";

//router object
const router = express.Router();

//routing 
//register || method post
router.post('/register', registerController);

//login || method post
router.post('/login', loginController);

export default router;  