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
    const [rows] = await db.query(`
      SELECT 
        o.order_id,
        o.user_id,
        o.product_id,
        o.quantity,
        o.price_per_unit,
        o.total_price,
        o.shipping_name,
        o.shipping_phone,
        o.shipping_address,
        o.payment_method,
        o.payment_status,
        o.order_status,
        o.delivery_date,
        o.created_at,
        o.updated_at,
        p.name AS product_name,
        p.price AS product_price,
        p.rating AS product_rating,
        p.discount AS product_discount,
        p.description AS product_description,
        p.category AS product_category,
        p.stock AS product_stock,
        p.image AS product_image
      FROM orders o
      JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC
  `);
    return rows;
  },

  // Get order by ID
  getById: async (user_id) => {
    const [rows] = await db.query(
      `SELECT 
          o.order_id,
          o.user_id,
          o.product_id,
          o.quantity,
          o.price_per_unit,
          o.total_price,
          o.shipping_name,
          o.shipping_phone,
          o.shipping_address,
          o.payment_method,
          o.payment_status,
          o.order_status,
           o.Reason,
        o.cancelled,
        o.delivery_date,
          o.created_at,
          o.updated_at,
          p.name AS product_name,
          p.price AS product_price,
          p.rating AS product_rating,
          p.discount AS product_discount,
          p.description AS product_description,
          p.category AS product_category,
          p.stock AS product_stock,
          p.image AS product_image
       FROM orders o
       JOIN products p ON o.product_id = p.id
       WHERE o.user_id = ? 
       ORDER BY o.order_id DESC`,
      [user_id]
    );

    return rows; // return all matched orders with product details
  },
};

module.exports = Order;
