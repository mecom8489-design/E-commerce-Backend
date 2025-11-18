const db = require("../config/db");

const Product = {
  liveSearch: (query) => {
    const sql = `
      SELECT * FROM products
      WHERE name LIKE ? 
      OR description LIKE ?
      OR category LIKE ?
      ORDER BY name ASC
      LIMIT 30
    `;
    const like = `%${query}%`;
    return db.execute(sql, [like, like, like]);
  }
};

module.exports = Product;
