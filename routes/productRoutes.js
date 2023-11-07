import express from 'express';
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { createProductController, getAllProductsController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

//routes
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

//get all products
router.get('/get-products', getAllProductsController);

export default router;