import express from "express";
import { registerController } from "../controllers/authController.js";

//router object
const router = express.Router();

//routing || method post
router.post('/register', registerController);

export default router;  