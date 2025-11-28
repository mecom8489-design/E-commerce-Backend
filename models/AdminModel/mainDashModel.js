const pool = require("../../config/db");

const Status = {
  async getUserStatus() {
    // <-- Use camelCase here
    const [result] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM products) AS products,
        (SELECT COUNT(*) FROM orders) AS orders
    `);

    return result[0];
  },
  async getRecentOrders() {
    const [rows] = await pool.execute(`
    SELECT 
      o.order_id AS id,
      CONCAT(u.firstname, ' ', u.lastname) AS customername,
      p.name AS productname,
      o.total_price AS totalamount,
      o.order_status AS status
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN products p ON o.product_id = p.id
    ORDER BY o.created_at DESC
    LIMIT 10
  `);

    return rows;
  },
};

module.exports = Status;
