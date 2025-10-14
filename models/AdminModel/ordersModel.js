const pool = require("../../config/db");

const Orders = {
  // Get all categories
 async getAll() {
  const [rows] = await pool.execute(`
    SELECT 
      o.id AS orderid,
      CONCAT(u.firstname, ' ', u.lastname) AS customername,
      p.name AS productname,
      o.quantity,
      o.totalamount,
      o.status,
      o.createdat
    FROM orders o
    JOIN users u ON o.userid = u.id
    JOIN products p ON o.productid = p.id
    ORDER BY o.createdat DESC
  `);

  return rows;
}

};

module.exports = Orders;
