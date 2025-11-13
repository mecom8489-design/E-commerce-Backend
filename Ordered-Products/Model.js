const db = require("../config/db");

const Order = {
  // Create new order
  create: async (orderData) => {
    const sql = `
      INSERT INTO orders 
      (user_id, product_id, quantity, price_per_unit, total_price, 
       shipping_name, shipping_phone, shipping_address, payment_method, 
       payment_status, order_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      orderData.user_id,
      orderData.product_id,
      orderData.quantity,
      orderData.price_per_unit,
      orderData.total_price,
      orderData.shipping_name,
      orderData.shipping_phone,
      orderData.shipping_address,
      orderData.payment_method,
      orderData.payment_status || "Pending",
      orderData.order_status || "Placed",
    ];

    const [result] = await db.query(sql, values);
    return result;
  },

  // Get all orders
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM orders ORDER BY created_at DESC");
    return rows;
  },

  // Get order by ID
  getById: async (order_id) => {
    const [rows] = await db.query("SELECT * FROM orders WHERE order_id = ?", [order_id]);
    return rows[0];
  },
};

module.exports = Order;
