const pool = require("../../config/db");

const Product = {
  async create(data) {
    const {
      name,
      price,
      rating,
      discount,
      description,
      category,
      stock,
      image,
    } = data;
    const [result] = await pool.execute(
      `INSERT INTO products (name, price, rating, discount, description, category, stock, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, price, rating, discount, description, category, stock, image]
    );
    return result;
  },

  async getAll() {
    const [rows] = await pool.execute(`
    SELECT *, price * (1 - (discount / 100)) AS finalPrice 
    FROM products
  `);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.execute("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },

  async update(id, data) {
    const {
      name,
      price,
      rating,
      discount,
      description,
      category,
      stock,
      image,
    } = data;
    const [result] = await pool.execute(
      `UPDATE products 
       SET name = ?, price = ?, rating = ?, discount = ?, description = ?, category = ?, stock = ?, image = ?
       WHERE id = ?`,
      [name, price, rating, discount, description, category, stock, image, id]
    );
    return result;
  },

  async delete(id) {
    const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [
      id,
    ]);
    return result;
  },
};

module.exports = Product;
