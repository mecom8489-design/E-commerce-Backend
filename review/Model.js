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
  getReviewsByProduct: async (product_id, offset, limit) => {
    const sql = `
      SELECT 
        r.id AS review_id,
        r.rating,
        r.review_text,
        r.created_at,
  
        p.id AS product_id,
        p.name AS product_name,
        p.category AS product_category,
        p.image AS product_image,
        p.price,
        p.offer,
  
        u.id AS user_id,
        CONCAT(u.firstname, ' ', u.lastname) AS user_name,
        u.email AS user_email,
        u.mobile AS user_mobile
  
      FROM product_reviews r
      JOIN products p ON r.product_id = p.id
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT ?, ?;
    `;
  
    const [rows] = await db.query(sql, [product_id, offset, limit]);
    return rows;
  }
  
};
