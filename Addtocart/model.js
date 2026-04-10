const db = require("../config/db");

const addtocart = {
// ✅ Add product to wishlist
create: async (user_id, product_id) => {
    const sql = `
      INSERT IGNORE INTO addtocart (user_id, product_id)
      VALUES (?, ?)
    `;
    const [result] = await db.query(sql, [user_id, product_id]);
    return result;
},


 // ✅ Get wishlist by user_id
 getaddtocart: async (user_id) => {
    const sql = `
      SELECT
        a.id AS addtocart_id,
        a.user_id,
        a.created_at AS addtocart_created_at,
        p.*
      FROM addtocart a
      INNER JOIN products p ON a.product_id = p.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `;

    const values = [user_id];
    const [rows] = await db.query(sql, values);
    return rows;
  },



  deleteaddtocart: async (user_id, product_id) => {
    const sql = `
      DELETE FROM addtocart
      WHERE user_id = ? AND product_id = ?
    `;

    const values = [user_id, product_id];
    const [result] = await db.query(sql, values);
    return result;
  }



}

module.exports = addtocart;