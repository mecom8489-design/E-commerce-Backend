const db = require("../config/db");

const wishlist = {

  // ✅ Add product to wishlist
  create: async (user_id, product_id) => {
    const sql = `
      INSERT IGNORE INTO wishlist (user_id, product_id)
      VALUES (?, ?)
    `;
    const [result] = await db.query(sql, [user_id, product_id]);
    return result;
  },
  

  // ✅ Get wishlist by user_id
  getWishlist: async (user_id) => {
    const sql = `
      SELECT
        w.id AS wishlist_id,
        w.user_id,
        w.created_at AS wishlist_created_at,
        p.*
      FROM wishlist w
      INNER JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `;

    const values = [user_id];
    const [rows] = await db.query(sql, values);
    return rows;
  },
  deleteWishlist: async (user_id, product_id) => {
    const sql = `
      DELETE FROM wishlist
      WHERE user_id = ? AND product_id = ?
    `;

    const values = [user_id, product_id];
    const [result] = await db.query(sql, values);
    return result;
  }

};

module.exports = wishlist;
