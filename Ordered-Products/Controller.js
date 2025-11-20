const Order = require("./Model");
const nodemailer = require("nodemailer");
const db = require("../config/db"); // ✅ Correct path

const getFullImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
 
  imagePath = imagePath.trim().replace(/^\/+/, "");
 
  // If Cloudinary or any full URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
 
  // Local uploads
  return `${req.protocol}://${req.get('host')}/${imagePath.replace(/\\/g, '/')}`;
};
 
// -----------------------------------------------------
// ✅ CREATE ORDER (+ stock reduce)
// -----------------------------------------------------
exports.createOrder = async (req, res) => {
  try {
    const {
      user_id,
      product_id,
      quantity,
      price_per_unit,
      total_price,
      shipping_name,
      shipping_phone,
      shipping_address,
      payment_method,
      payment_status,
      order_status,
      user_email,
      productname,
    } = req.body;

    if (!user_id || !product_id || !shipping_name || !shipping_phone || !shipping_address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const orderData = {
      user_id,
      product_id,
      quantity,
      price_per_unit,
      total_price,
      shipping_name,
      shipping_phone,
      shipping_address,
      payment_method,
      payment_status,
      order_status,
    };

    const result = await Order.create(orderData);

    // ⭐ Reduce product stock
    await db.query(
      "UPDATE products SET stock = stock - ? WHERE id = ?",
      [quantity, product_id]
    );

    // ---------------------------------------------------
    // EMAIL CODE (your original code untouched)
    // ---------------------------------------------------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mecom8489@gmail.com",
        pass: "yvmo vjoo pqee utbg",
      },
    });

    const mailOptions = {
      from: '"Your Shop Name" <yourgmail@gmail.com>',
      to: user_email,
      subject: "Order Confirmation - Thank you for your purchase!",
      html: `
        <h2>Hi ${shipping_name},</h2>
        <p>Thank you for your order!</p>
        <p><strong>Product:</strong> ${productname}</p>
        <p><strong>Total Price:</strong> ₹${total_price}</p>
        <p><strong>Shipping Address:</strong> ${shipping_address}</p>
        <p>We’ll notify you once your order has been shipped.</p>
        <br/>
        <p>Best regards,<br><strong>Your Shop Name</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Order placed successfully & email sent",
      order_id: result.insertId,
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -----------------------------------------------------
// 📦 Get all orders
// -----------------------------------------------------
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -----------------------------------------------------
// 🔍 Get order by user id
// -----------------------------------------------------
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.getById(id);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    const productsWithUrl = orders.map((p) => ({
      ...p,
      product_image: getFullImageUrl(req, p.product_image),
    }));

    return res.status(200).json(productsWithUrl);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -----------------------------------------------------
// ❌ CANCEL ORDER (+ stock restore)
// -----------------------------------------------------
exports.cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Get order
    const [[order]] = await db.query(
      "SELECT product_id, quantity, cancelled FROM orders WHERE order_id = ?",
      [order_id]
    );

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (order.cancelled === 1)
      return res.status(400).json({ message: "Order already cancelled" });

    // Mark as cancelled
    await db.query(
      "UPDATE orders SET cancelled = 1 WHERE order_id = ?",
      [order_id]
    );

    // ⭐ Restore stock
    await db.query(
      "UPDATE products SET stock = stock + ? WHERE id = ?",
      [order.quantity, order.product_id]
    );

    return res.status(200).json({
      message: "Order cancelled successfully & stock restored",
    });

  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
