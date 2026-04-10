const db = require("../config/db");

const PaymentsModel = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT
    -- Orders table
    o.order_id,
    o.user_id AS order_user_id,
    o.product_id AS order_product_id,
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
    o.Reason,
    o.cancelled,
    o.created_at AS order_created_at,
    o.updated_at AS order_updated_at,
    o.razorpay_payment_id,
    o.razorpay_order_id,
    o.razorpay_signature,

    -- Products table
    p.id AS product_id,
    p.name AS product_name,
    p.price AS product_price,
    p.rating,
    p.discount,
    p.description,
    p.category,
    p.stock,
    p.image,
    p.offer,
    p.thersold,
    p.created_at AS product_created_at,

    -- Users table
    u.id AS user_id,
    u.firstname,
    u.lastname,
    u.email,
    u.mobile,
    u.role,
    u.address,
    u.created_at AS user_created_at,
    u.updated_at AS user_updated_at

FROM orders o
INNER JOIN users u ON o.user_id = u.id
INNER JOIN products p ON o.product_id = p.id

WHERE o.cancelled = 0       
-- AND o.payment_status = 'Paid'  
ORDER BY o.created_at DESC;

    `);
    return rows;
  }
};

module.exports = PaymentsModel;
