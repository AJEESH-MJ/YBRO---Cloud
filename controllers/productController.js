import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";

export const createProductController = async (req, res) => {
    try {
        const { name, slug, price, description, category, quantity, shipping } = req.fields;
        const { image } = req.files;

        //validation
        switch(true) {
            case !name:
                return res.status(500).json({ message: "Name is required" });
            case !price:
                return res.status(500).json({ message: "Price is required" });
            case !description:
                return res.status(500).json({ message: "Description is required" });
            case !category:
                return res.status(500).json({ message: "Category is required" });
            case !quantity:
                return res.status(500).json({ message: "Quantity is required" });
            case image && image.size > 1000000:
                return res.status(500).json({ message: "Image should be less than 1mb and is required" });
        }

         // Check if the category exists in the Category model
         let existingCategory;
         try {
             existingCategory = await categoryModel.findOne({ name: category });
             console.log("Found category:", existingCategory);
         } catch (error) {
             console.error("Error while checking category:", error);
             return res.status(500).json({ message: "Error while checking category" });
         }
 
         if (!existingCategory) {
             // If the category doesn't exist, you can create it
             try {
                 existingCategory = new categoryModel({ name: category, slug: slugify(category) });
                 await existingCategory.save();
             } catch (error) {
                 return res.status(500).json({ message: "Error while creating category" });
             }
         }
 
         const product = new productModel({
             name,
             slug: slugify(name),
             price,
             description,
             category: existingCategory._id, 
             image,
             quantity,
             shipping,
         });
 
         if (image) {
             product.image.data = fs.readFileSync(image.path);
             product.image.contentType = image.type;
         }
 
         await product.save();
 
         res.status(201).json({ success: true, message: "Product created successfully", product });
     } catch (error) {
         res.status(400).json({ message: error.message });
     }
 };

 //get all products
    export const getAllProductsController = async (req, res) => {
        try {
            const products = await productModel.find({}).select("-image.data");
            res.status(200).json({ success: true, products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    };