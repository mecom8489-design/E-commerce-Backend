const express = require("express");
const router = express.Router();
const categoryController = require("../../Controllers/AdminControl/categoryController");

router.get("/getAllCategory", categoryController.getAllCategories);
router.post("/addCategory", categoryController.createCategory);
router.delete("/deleteCategory/:id", categoryController.deleteCategory);

module.exports = router;
