import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

//create category controller
export const CreateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(401).json({ success: false, msg: "Name is required" });
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory)
      return res
        .status(200)
        .json({ success: true, msg: "Category already exists" });
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res
      .status(200)
      .json({ success: true, category, msg: "Category created successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error, msg: "Error while creating category" });
  }
};

//update category controller
export const UpdateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
        res.status(200).json({ success: true, category, msg: "Category updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error, msg: "Error while updating category" });        
    }
};


//get all categories controller
export const GetAllCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).json({ success: true, categories, msg: "Categories fetched successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error, msg: "Error while fetching categories" });        
    }
};

//get a single category controller
export const GetCategoryController = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryModel.findOne({ slug });
        res.status(200).json({ success: true, category, msg: "Category fetched successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error, msg: "Error while fetching category" });        
    }
};

//delete category controller
export const DeleteCategoryController = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryModel.findOneAndDelete({ slug });
        res.status(200).json({ success: true, category, msg: "Category deleted successfully" });        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error, msg: "Error while deleting category" });        
    }
};