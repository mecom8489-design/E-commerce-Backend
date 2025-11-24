const db = require("../config/db");

module.exports = {
  create: async (reviewData) => {
    const sql = `
      INSERT INTO product_reviews 
      (user_id, product_id, rating, review_text)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      reviewData.user_id,
      reviewData.product_id,
      reviewData.rating,
      reviewData.review_text || null,
    ];

    const [result] = await db.query(sql, values);
    return result;
  },

  // (OPTIONAL) get reviews for product
  getReviewsByProduct: async (product_id) => {
    const sql = `
      SELECT * FROM product_reviews
      WHERE product_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql, [product_id]);
    return rows;
  }
};
