const Category = require("../../models/AdminModel/categoryModel");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { productCategory } = req.body;

    if (!productCategory) {
      return res.status(400).json({ message: "productCategory is required" });
    }

    const result = await Category.create({ productCategory: productCategory });

    return res.status(201).json({
      message: "Category created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ message: "Valid category ID is required." });
    }

    const result = await Category.remove(id);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Category not found or already deleted." });
    }

    return res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
