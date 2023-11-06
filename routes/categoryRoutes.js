import express from "express";
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { CreateCategoryController, DeleteCategoryController, GetAllCategoriesController, GetCategoryController, UpdateCategoryController } from "../controllers/categoryController.js";

const router = express.Router();

//routes
//create category || method post
router.post('/create-category', requireSignIn, isAdmin, CreateCategoryController);

//update category || method put
router.put('/update-category/:id', requireSignIn, isAdmin, UpdateCategoryController);

//get all categories || method get
router.get('/get-categories', GetAllCategoriesController);

//get a single category || method get
router.get('/get-category/:slug', GetCategoryController);

//delete category || method delete
router.delete('/delete-category/:slug', requireSignIn, isAdmin, DeleteCategoryController);


export default router;