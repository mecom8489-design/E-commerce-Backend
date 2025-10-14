const pool = require("../../config/db");

const Category = {
  // Get all categories
  async getAll() {
    const [rows] = await pool.execute("SELECT * FROM categories");
    return rows;
  },

  // Create a new category
  async create({ productCategory }) {
    const [result] = await pool.execute(
      `INSERT INTO categories (productCategory, updatedBy)
       VALUES (?, ?)`,
      [productCategory, "admin"]
    );
    return result;
  },

  // Delete a category by ID
  async remove(id) {
    const [result] = await pool.execute("DELETE FROM categories WHERE id = ?", [
      id,
    ]);
    return result;
  },
};

module.exports = Category;
