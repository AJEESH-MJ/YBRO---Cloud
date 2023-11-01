import express from "express";
import { loginController, registerController, testController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing 
//register || method post
router.post('/register', registerController);

//login || method post
router.post('/login', loginController);

//test routes
router.get('/test', requireSignIn, isAdmin, testController);

export default router;  